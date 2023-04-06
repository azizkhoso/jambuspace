const express = require('express');
const router = express.Router();
const Joi = require('joi');

const imagesUploader = require('../../../helpers/imagesUploader');
const isEmpty = require('../../../helpers/isEmpty');
const Seller = require('../../../models/Seller');
const bidRoutes = require('./bids');
const gigRoutes = require('./gigs');
const jobRoutes = require('./jobs');
const notificationRoutes = require('./notifications');
const stripe = require('../../../helpers/stripeConfig');

const sellerImageUrl = '/media/images/seller/';

const uploadSellerFilesMiddleware = imagesUploader('/seller').fields([
  { name: 'image', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
]);

// bid routes
router.use('/bids', bidRoutes);
// gig routes
router.use('/gigs', gigRoutes);
// job routes that are only for sellers
router.use('/jobs', jobRoutes);
// notification routes
router.use('/notifications', notificationRoutes);

const updateSchema = Joi.object({
  fullName: Joi.string().min(3).max(255),
  username: Joi.string().min(3).max(255),
  // can not change these fields directly
  // these need special api routes for update
  /* email: Joi.string().email().max(255),
  emailVerified: Joi.bool(),
  password: Joi.string().max(255), */
  city: Joi.string().max(255),
  country: Joi.string().max(255),
  skills: Joi.array().items(Joi.string()),
  phone: Joi.string().regex(new RegExp(`^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$`)),
  /* image: Joi.object({
    path: Joi.string(),
    url: Joi.string(),
    filename: Joi.string(),
  }), */
  company: Joi.string(),
  // rating: Joi.number(),
  earnings: Joi.number(),
  // these should not be updated directly
  /* jobs: Joi.array().items(Joi.string()),
  bids: Joi.array().items(Joi.string()), */
  about: Joi.string(),
  education: Joi.array().items(
    Joi.object({
      school: Joi.string(),
      degree: Joi.string(),
      fieldOfStudy: Joi.string(),
      startDate: Joi.object({
        month: Joi.number().integer().min(1).max(12),
        year: Joi.number().integer().min(1950),
      }),
      endDate: Joi.object({
        month: Joi.number().integer().min(1).max(12),
        year: Joi.number().integer().min(1950),
      }),
      grade: Joi.string().min(1),
      description: Joi.string().min(10).max(255),
    }),
  ),
});

router.put('/', async (req, res) => {
  // only logged in seller can update his profile
  if (!req.session.user) return res.status(403).json({ message: 'Not logged in' });
  const sellerID = req.session?.user?._id;
  try {
    // validate and remove unknown values
    const data = updateSchema.validate(req.body, { stripUnknown: true });
    if (data.error) return res.status(400).json({ message: data.error.details[0].message });
    const sellerExist = await Seller.findById(sellerID);
    if (sellerExist) {
      const payload = data.value;
      await Seller.findByIdAndUpdate(sellerID, {
        $set: payload,
      });
      // send back the updated data
      res.json(payload);
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put('/files', async (req, res) => {
  uploadSellerFilesMiddleware(req, res, async (err) => {
    if (err) {
      return err.code === 'LIMIT_FILE_SIZE'
        ? res.status(400).json({ message: 'File too large. Must be less than 200 KB' })
        : res.status(400).json({ message: err.message });
    }
    // if no files no need to move forward
    if (isEmpty(req.files)) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    let payload = {};
    if (req.files.image) {
      // handling profile image upload
      const sellerImage = {
        path: req.files.image[0].path,
        url: sellerImageUrl + req.files.image[0].filename,
        filename: req.files.image[0].filename,
      };
      payload.image = sellerImage;
    }
    if (req.files.resume) {
      // handling resume upload
      const resumeFile = {
        path: req.files.resume[0].path,
        url: sellerImageUrl + req.files.resume[0].filename,
        filename: req.files.resume[0].filename,
      };
      payload.resume = resumeFile;
    }
    const updated = await Seller.updateOne(
      { _id: req?.session?.user?._id },
      { $set: payload },
      { new: true },
    );
    if (updated) {
      console.log(updated._doc);
      res.json(payload);
    } else {
      res.status(500).json({ message: 'An error occured while updating files ' });
    }
  });
});

// this end point is for handling subscriptions
router.put('/toggle-subscribe/:technology', async (req, res) => {
  try {
    if (!req.params.technology) throw new Error('Technology title not supplied');
    const seller = await Seller.findById(req.session.user._id).lean();
    if (!seller) throw new Error('Seller not found');
    const foundTech = seller.subscriptions.find(
      (s) => s.toLowerCase() === req.params.technology.toLowerCase(),
    );
    if (!foundTech) {
      seller.subscriptions.push(req.params.technology);
    } else {
      seller.subscriptions = seller.subscriptions.filter(
        (s) => s.toLowerCase() !== req.params.technology.toLowerCase(),
      );
    }
    await Seller.findOneAndUpdate(
      req.session.user._id,
      {
        $set: { subscriptions: seller.subscriptions },
      },
      { $new: true },
    ).lean();
    res.json(seller.subscriptions);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put('/create-stripe-account', async (req, res) => {
  try {
    const foundSeller = await Seller.findById(req.session?.user?._id).lean();
    // if account already present, no need to create again
    if (foundSeller.stripeId) return res.json({ stripeId: foundSeller.stripeId });
    // if account not created
    const acount = await stripe.accounts.create({
      type: 'express',
      country: stripe.countries.find((c) => c.name === foundSeller.country)?.code,
      email: foundSeller.email,
      business_type: 'individual',
      default_currency: 'aud',
      capabilities: {
        card_payments: { requested: false }, // don't allow for doing personal payments
        transfers: { requested: true },
      },
      settings: {
        payouts: {
          schedule: {
            interval: 'manual', // the user should only with draw when he wants
          },
        },
      },
    });
    // Create an account link for the user's Stripe account
    const accountLink = await stripe.accountLinks.create({
      account: acount.id,
      refresh_url: `${process.env.BACKEND_URL}/api/sellers/create-stripe-account`,
      return_url: `${process.env.BACKEND_URL}/api/sellers/onboarded?stripeId=${acount.id}`,
      type: 'account_onboarding',
      collect: 'eventually_due',
    });
    res.json({ url: accountLink.url });
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
});

router.get('/onboarded', async (req, res) => {
  try {
    const { stripeId } = req.query;
    if (!stripeId) return res.redirect(`${process.env.FRONTEND_URL}/`);
    const account = await stripe.accounts.retrieve(stripeId);
    if (account.details_submitted) {
      await Seller.findByIdAndUpdate(
        req.session?.user?._id,
        {
          $set: { stripeId },
        },
        { new: true },
      );
      return res.redirect(`${process.env.FRONTEND_URL}/pages/profile`);
    } else return res.redirect(`${process.env.FRONTEND_URL}/`);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
});

router.get('/stripe-login-link', async (req, res) => {
  try {
    const foundSeller = await Seller.findById(req.session?.user?._id);
    if (!foundSeller.stripeId) throw { status: 400, message: 'Stripe account is not setup' };
    const loginLink = await stripe.accounts.createLoginLink(foundSeller.stripeId);
    return res.json({ url: loginLink.url });
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
});

module.exports = router;
