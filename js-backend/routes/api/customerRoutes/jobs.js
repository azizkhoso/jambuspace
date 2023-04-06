require('dotenv').config();
const express = require('express');
const Joi = require('joi');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const Job = require('../../../models/Job');
const Bid = require('../../../models/Bid');
const Customer = require('../../../models/Customer');
const CompanyMargin = require('../../../models/CompanyMargin');
const imagesUploader = require('../../../helpers/imagesUploader');
const removeFile = require('../../../helpers/removeFile');
const transport = require('../../../helpers/transport');

const router = express.Router();

const uploadJobImageMiddleware = imagesUploader('/job').fields([{ name: 'image', maxCount: 1 }]);

const jobImageUrl = '/media/images/job/';

router.get('/', async (req, res) => {
  try {
    const query = Job.find({
      customer: req?.session?.user?._id,
    }).sort('-createdAt');
    if (req.query.technology) {
      query.where({ technologies: { $regex: new RegExp(req.query.technology, 'ig') } }); // ig represent case-insensitive and globally in full string
    }
    query.lean();
    const response = await query.exec();
    res.json(response);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await Job.findById(req.params.id)
      .populate({ path: 'bids', populate: { path: 'seller' } })
      .lean();
    if (!response) throw new Error('Job not found');
    res.json(response);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post('/', async (req, res) => {
  uploadJobImageMiddleware(req, res, async (err) => {
    try {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE')
          throw new Error('File too large. Must be less than 6 Mb');
        else throw new Error(err);
      }
      const data = Job.validateJob({ ...req.body, customer: req?.session?.user?._id });
      if (data.error) throw new Error(data.error.details[0].message);
      const payload = {
        ...data.value,
      };
      if (req.files.image) {
        const bidImage = {
          path: req.files.image[0].path,
          url: jobImageUrl + req.files.image[0].filename,
          filename: req.files.image[0].filename,
        };
        payload.image = bidImage;
      }
      // setting jambuSpace charges
      const companyMargin = await CompanyMargin.findOne().lean();
      payload.companyMargin = companyMargin.margin;
      const job = await Job.create(payload);
      // Add job in Customer Jobs as well
      await Customer.findByIdAndUpdate(payload.customer, {
        $push: { jobs: job._id },
      });
      res.json(job);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  });
});

const updateSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  budget: Joi.number().greater(0),
  status: Joi.string(),
  // customer: Joi.string(),
  dueDate: Joi.string(),
  deliveryDate: Joi.string(),
  duration: Joi.string(),
  experienceLevel: Joi.string(),
  technologies: Joi.array().items(Joi.string()),
});

router.put('/:id', async (req, res) => {
  uploadJobImageMiddleware(req, res, async (err) => {
    try {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE')
          throw new Error('File too large. Must be less than 6 Mb');
        else throw new Error(err);
      }
      const data = updateSchema.validate(req.body, { stripUnknown: true });
      if (data.error) throw new Error(data.error.details[0].message);
      const payload = {
        ...data.value,
      };
      if (req.files.image) {
        const jobImage = {
          path: req.files.image[0].path,
          url: jobImageUrl + req.files.image[0].filename,
          filename: req.files.image[0].filename,
        };
        payload.image = jobImage;
      }
      // setting jambuSpace charges
      const companyMargin = await CompanyMargin.findOne().lean();
      payload.companyMargin = companyMargin.margin;
      const result = await Job.findOneAndUpdate(
        { _id: req.params.id, customer: req.session?.user?._id }, // passing customer id so that only logged in can update
        {
          $set: payload,
        },
      );
      if (!result) throw new Error('Job not found');
      if (req.files.image && result.image) removeFile(result.image.path);
      res.json(payload);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  });
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await Job.findOneAndDelete({
      _id: req.params.id,
      customer: req.session?.user?._id,
    });
    if (!result) throw new Error('Job not found');
    if (result.image) removeFile(result.image.path);
    res.json({ id: result._id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put('/:id/complete', async (req, res) => {
  try {
    const foundJob = await Job.findById(req.params.id).populate([
      {
        path: 'customer'
      }, {
        path: 'hiredBid',
        populate: { path: 'seller' },
      }]);
    if (!foundJob) return res.status(404).json({ message: 'Job not found' });
    // Retrieve the Checkout Session ID
    const checkoutSessionId = foundJob.sessionId;
    // Retrieve the payment intent associated with the Checkout Session ID
    const checkoutSession = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
      expand: ['payment_intent'],
    });
    const paymentIntent = checkoutSession.payment_intent;
    // Retrieve the charge ID from the payment intent
    const chargeId = paymentIntent.charges.data[0].id;
    // Create a transfer using the charge ID as the source transaction
    const totalAmount = foundJob.hiredBid.amount * 100;
    const stripeMargin = foundJob.companyMargin * totalAmount;
    const transfer = await stripe.transfers.create({
      amount: totalAmount - stripeMargin,
      currency: 'aud',
      description: foundJob.title,
      destination: foundJob.hiredBid.seller.stripeId,
      source_transaction: chargeId,
      metadata: {
        // information about the item for which the payment is done
        type: 'bid', // type can also be job, order, gig
        id: foundJob.hiredBid._id.toString(),
        customer: foundJob.customer.email,
        seller: foundJob.hiredBid.seller.email,
        session: foundJob.sessionId, // the id of session from which payment was collected
      },
    });
    await foundJob.updateOne({ $set: { status: 'COMPLETED' } });
    await Bid.findByIdAndUpdate(foundJob.hiredBid, {
      $set: { status: 'COMPLETED' },
    });
    res.json({ transfer: transfer.id });
    transport.sendMail({
      to: foundJob.hiredBid.seller.email,
      from: process.env.GMAIL,
      subject: 'Your bid was completed',
      text: `Congratulations! Your bid for job '${foundJob.title}' was completed!`,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id/checkout', async (req, res) => {
  try {
    const { bid } = req.query;
    if (!bid) throw { status: 400, message: 'Bid id is not supplied' };
    const foundBid = await Bid.findById(bid).populate('seller').lean();
    if (!foundBid) throw { status: 404, message: 'Bid not found' };
    const foundJob = await Job.findById(req.params.id).populate('customer').lean();
    if (!foundJob) throw { status: 404, message: 'Job not found' };
    if (foundJob.hiredBid) throw { status: 400, message: 'Job is already assigned to a bid' };
    const session = await stripe.checkout.sessions.create({
      currency: 'aud',
      mode: 'payment',
      customer_email: foundJob.customer.email,
      metadata: {
        // information about the item for which the payment is done
        type: 'bid', // type can also be job, order, gig
        id: foundBid._id.toString(),
        customer: foundJob.customer.email,
        seller: foundBid.seller.email,
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'aud',
            unit_amount: foundBid.amount * 100,
            product_data: {
              name: foundJob.title,
            },
          },
        },
      ],
      success_url: `${process.env.BACKEND_URL}/api/customers/jobs/${foundJob._id}/confirm-checkout`,
      cancel_url: `${process.env.FRONTEND_URL}/pages/dashboard`,
    });
    await Job.findByIdAndUpdate(foundJob._id, {
      $set: { sessionId: session.id },
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
});

router.get('/:id/confirm-checkout', async (req, res) => {
  try {
    const { id: jobId } = req.params;
    if (!jobId) throw { status: 400, message: 'Job id missing' };
    const foundJob = await Job.findById(jobId).lean();
    if (!foundJob) return res.redirect(`${process.env.FRONTEND_URL}/pages/dashboard`);
    const foundSession = await stripe.checkout.sessions.retrieve(foundJob.sessionId);
    if (foundSession.status == 'complete') {
      const updated = await Job.findByIdAndUpdate(
        foundJob._id,
        {
          $set: { hiredBid: foundSession.metadata.id, status: 'HIRED' },
        },
        { new: true },
      )
        .populate({ path: 'hiredBid', populate: { path: 'seller' } })
        .lean();
      await Bid.findByIdAndUpdate(foundSession.metadata.id, {
        $set: { status: 'HIRED' },
      });
      transport.sendMail({
        to: updated.hiredBid.seller.email,
        from: process.env.GMAIL,
        subject: 'Your bid was hired',
        text: `Congratulations! Your bid for job '${foundJob.title}' was hired!`,
      });
      return res.redirect(`${process.env.FRONTEND_URL}/pages/dashboard`);
    }
  } catch (e) {
    console.log(e);
    res.status(e.status || 500).json({ message: e.message });
  }
});

module.exports = router;
