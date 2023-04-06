const express = require('express');
const router = express.Router();
const Joi = require('joi');

const imagesUploader = require('../../../helpers/imagesUploader');
const isEmpty = require('../../../helpers/isEmpty');
const Customer = require('../../../models/Customer');
const jobRoutes = require('./jobs');
const orderRoutes = require('./orders');
const notificationRoutes = require('./notifications');

const customerImageUrl = '/media/images/customer/';

const uploadCustomerFilesMiddleware = imagesUploader('/customer').fields([
  { name: 'image', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
]);

// customer jobs
router.use('/jobs', jobRoutes);
router.use('/orders', orderRoutes);
// notification routes
router.use('/notifications', notificationRoutes);

const updateSchema = Joi.object({
  fullName: Joi.string().min(3).max(255),
  username: Joi.string().min(3).max(255),
  /*email: Joi.string().email().max(255),
  emailVerified: Joi.bool(),
  password: Joi.string().min(8).max(255), */
  city: Joi.string().max(255),
  country: Joi.string().max(255),
  phone: Joi.string().regex(new RegExp(`^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$`)),
  image: Joi.object({
    path: Joi.string(),
    url: Joi.string(),
    filename: Joi.string(),
  }),
  company: Joi.string(),
  /* type: Joi.string(),
  rating: Joi.number(), */
  spendings: Joi.number(),
  jobs: Joi.array().items(Joi.string()),
  about: Joi.string(),
});
router.put('/', async (req, res) => {
  // only logged in seller can update his profile
  if (!req.session.user) return res.status(403).json({ message: 'Not logged in' });
  const customerID = req.session?.user?._id;
  try {
    // validate and remove unknown values
    const data = updateSchema.validate(req.body, { stripUnknown: true });
    if (data.error) return res.status(400).json({ message: data.error.details[0].message });
    const customerExist = await Customer.findById(customerID);
    if (customerExist) {
      const payload = data.value;
      await Customer.findByIdAndUpdate(customerID, {
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
  uploadCustomerFilesMiddleware(req, res, async (err) => {
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
        url: customerImageUrl + req.files.image[0].filename,
        filename: req.files.image[0].filename,
      };
      payload.image = sellerImage;
    }
    if (req.files.resume) {
      // handling resume upload
      const resumeFile = {
        path: req.files.resume[0].path,
        url: customerImageUrl + req.files.resume[0].filename,
        filename: req.files.resume[0].filename,
      };
      payload.resume = resumeFile;
    }
    const updated = await Customer.updateOne(
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

module.exports = router;
