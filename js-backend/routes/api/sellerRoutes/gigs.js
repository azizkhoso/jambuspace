const express = require('express');
const router = express.Router();
const Joi = require('joi');

const removeFile = require('../../../helpers/removeFile');
const Gig = require('../../../models/Gig');
const imagesUploader = require('../../../helpers/imagesUploader');

const uploadGigImageMiddleware = imagesUploader('/gigs').fields([{ name: 'image', maxCount: 1 }]);
const gigImageUrl = '/media/images/gigs/';

const gigSchema = Joi.object({
  seller: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.object({
    path: Joi.string().required(),
    url: Joi.string().required(),
    filename: Joi.string().required(),
  }).required(),
});

const updateGigSchema = Joi.object({
  seller: Joi.string().optional(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  image: Joi.object({
    path: Joi.string().required(),
    url: Joi.string().required(),
    filename: Joi.string().required(),
  }).optional(),
});

// Get all gigs
router.get('/', async (req, res) => {
  try {
    const gigs = await Gig.find({ seller: req.session?.user?._id });
    res.json(gigs);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get a single gig
router.get('/:id', async (req, res) => {
  try {
    const gig = await Gig.findOne({ _id: req.params.id, seller: req.session?.user?._id });
    if (!gig) return res.status(404).json({ error: 'Gig not found' });
    res.json(gig);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Add a new gig
router.post('/', async (req, res) => {
  uploadGigImageMiddleware(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') throw new Error('File too large. Must be less than 6 Mb');
      else throw new Error(err);
    }
    const data = { ...req.body, seller: req.session?.user?._id };
    if (req.files?.image) {
      const bidImage = {
        path: req.files.image[0].path,
        url: gigImageUrl + req.files.image[0].filename,
        filename: req.files.image[0].filename,
      };
      data.image = bidImage;
    }
    const { error } = gigSchema.validate(data, { abortEarly: true, stripUnknown: true });
    if (error) return res.status(400).json({ error: error.message });
    try {
      const gig = await Gig.create(data);
      res.status(201).json(gig);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Gig title already exists' });
      }
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
});

// Update a gig
router.put('/:id', async (req, res) => {
  uploadGigImageMiddleware(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') throw new Error('File too large. Must be less than 6 Mb');
      else throw new Error(err);
    }
    const data = { ...req.body, seller: req.session?.user?._id };
    if (req.files?.image) {
      const bidImage = {
        path: req.files.image[0].path,
        url: gigImageUrl + req.files.image[0].filename,
        filename: req.files.image[0].filename,
      };
      data.image = bidImage;
    }
    const { error } = updateGigSchema.validate(data, { abortEarly: true, stripUnknown: true });
    if (error) return res.status(400).json({ error: error.message });
    const gig = await Gig.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
    try {
      if (!gig) return res.status(404).json({ error: 'Gig not found' });
      res.json(gig);
      try {
        removeFile(gig.image.filename);
      } catch (e) {
        console.log(e);
      }
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
});

// Delete a gig
router.delete('/:id', async (req, res) => {
  try {
    const gig = await Gig.findByIdAndDelete(req.params.id);
    if (!gig) return res.status(404).json({ error: 'Gig not found' });
    res.json({ message: 'Gig deleted successfully' });
    try {
      removeFile(gig.image.filename);
    } catch (e) {
      console.log(e);
    }
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
