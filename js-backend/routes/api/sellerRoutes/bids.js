const express = require('express');

const Bid = require('../../../models/Bid');
const Job = require('../../../models/Job');
const Seller = require('../../../models/Seller');
const imagesUploader = require('../../../helpers/imagesUploader');

const router = new express.Router();

const uploadBidImageMiddleware = imagesUploader('/bid').fields([{ name: 'image', maxCount: 1 }]);

const bidImageUrl = '/media/images/bid/';

router.get('/', async (req, res) => {
  try {
    const query = Bid.find({ seller: req.session?.user?._id }).sort('-createdAt');
    if (req.query.job) {
      query.where({ job: req.query.job });
    }
    query.populate({ path: 'job', populate: { path: 'customer' } }).lean();
    const result = await query.exec();
    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post('/', async (req, res) => {
  const foundSeller = await Seller.findById(req.session?.user?._id);
  if (!foundSeller.stripeId)
    return res.status(400).json({ message: 'Payment account is not setup' });
  uploadBidImageMiddleware(req, res, async (err) => {
    try {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE')
          throw new Error('File too large. Must be less than 6 Mb');
        else throw new Error(err);
      }
      const data = Bid.validateBid({
        ...req.body,
        milestones: req.body.milestones && JSON.parse(req.body.milestones),
      });
      if (data.error) throw new Error(data.error.details[0].message);
      const payload = {
        ...data.value,
        seller: req.session?.user?._id || undefined, // this will throw error on undefined
      };
      if (req.files.image) {
        const bidImage = {
          path: req.files.image[0].path,
          url: bidImageUrl + req.files.image[0].filename,
          filename: req.files.image[0].filename,
        };
        payload.image = bidImage;
      }
      const bid = await Bid.create(payload);
      // Add Bid id in Job as well
      await Job.findByIdAndUpdate(payload.job, {
        $push: { bids: bid._id },
      });
      // Add Bid in Seller Bids as well
      await Seller.findByIdAndUpdate(req.session?.user?._id, {
        $push: { bids: bid._id },
      });
      res.json(bid);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  });
});

module.exports = router;
