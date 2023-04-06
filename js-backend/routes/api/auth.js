const fs = require('fs');
const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const transporter = require('../../helpers/transport');
const asyncMiddleware = require('../../middlewares/async');
const imagesUploader = require('../../helpers/imagesUploader');
const Customer = require('../../models/Customer');
const Seller = require('../../models/Seller');
const UserOTPVerification = require('../../models/UserOTPVerification');
const { validateCustomer } = require('../../models/Customer');
const { validateSeller } = require('../../models/Seller');
const Admin = require('../../models/Admin');
const thankyouEmail = require('../../helpers/thankyouEmail');

const router = express.Router();

const customerImageUrl = '/media/images/customer/';
const sellerImageUrl = '/media/images/seller/';

router.get('/loggedin', async (req, res) => {
  // verifying login from session and sending user details
  try {
    if (!req.session?.user) throw new Error('Not logged in');
    let user = {};
    if (req.session?.user?.userType === 'seller') {
      const seller = await Seller.findById(req.session.user._id).select('-password').lean();
      user = seller;
    } else if (req.session?.user?.userType === 'customer') {
      const customer = await Customer.findById(req.session.user._id).select('-password').lean();
      user = customer;
    } else if (req.session?.user?.userType === 'admin') {
      const admin = await Admin.findById(req.session.user._id).select('-password').lean();
      user = admin;
    } else throw new Error('Invalid user');
    res.json({ user: { ...user, userType: req.session?.user?.userType } });
  } catch (e) {
    res.status(403).json({ message: e.message });
  }
});

router.post('/login', async (req, res) => {
  const isCustomer = req.body.type === 'customer';
  const isSeller = req.body.type === 'seller';
  const isAdmin = req.body.type === 'admin';

  if (isCustomer) {
    const customer = await Customer.findOne({ email: req.body.email }).lean();
    if (!customer) return res.status(400).json({ message: 'Invalid Email or Password!' });
    const validPassword = await bcrypt.compare(req.body.password, customer.password);

    if (!validPassword) return res.status(400).json({ message: 'Invalid Email or Password!' });

    if (!customer.emailVerified)
      return res.status(400).json({
        message: 'User Not Verified',
        _id: customer._id,
        userType: 'customer',
        emailVerified: false,
      });

    if (!customer.isEnabled) return res.status(403).json({ message: 'User not enabled' });
    // setting up session
    req.session.user = {
      _id: customer._id,
      email: customer.email,
      fullName: customer.fullName,
      isEnabled: customer.isEnabled,
      userType: 'customer',
    };
    res.json({ ...customer, userType: 'customer', password: undefined });
  }

  if (isSeller) {
    const seller = await Seller.findOne({ email: req.body.email }).lean();
    if (!seller) return res.status(400).json({ message: 'Invalid Email or Password!' });
    if (!seller.emailVerified)
      return res.status(400).json({
        message: 'Please check your email and verify your account!',
        _id: seller._id,
        userType: 'seller',
        emailVerified: false,
      });
    if (!seller.isEnabled) return res.status(403).json({ message: 'User not enabled' });
    const validPassword = await bcrypt.compare(req.body.password || '', seller.password || '');

    if (!validPassword) return res.status(400).json({ message: 'Invalid Email or Password!' });
    // setting up session
    req.session.user = {
      _id: seller._id,
      email: seller.email,
      fullName: seller.fullName,
      isEnabled: seller.isEnabled,
      userType: 'seller',
    };

    res.json({ ...seller, userType: 'seller', password: undefined });
  }

  if (isAdmin) {
    const admin = await Admin.findOne({ email: req.body.email }).lean();
    console.log('admin', admin);
    if (!admin) return res.status(400).json({ message: 'Invalid Email or Password!' });

    const validPassword = await bcrypt.compare(req.body.password, admin.password);

    if (!validPassword) return res.status(400).json({ message: 'Invalid Email or Password!' });
    // setting up session
    req.session.user = {
      _id: admin._id,
      fullName: 'Admin',
      userType: 'admin',
      email: req.body.email,
    };
    res.json({ ...admin, userType: 'admin', password: undefined });
  }
});

router.get('/logout', async (req, res) => {
  // destroying session on logout
  try {
    req.session?.destroy((err) => {
      if (err) throw err;
      res.json({ message: 'Logged out successfully' });
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

//send verfiication OTP email
const sendOTPVerificationEmail = async ({ _id, email }) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOption = {
      from: 'social_google@jambuspace.com',
      to: email,
      subject: 'Verify Email',
      html: `<p>Enter ${otp} in the app to verify your account, this code will expired in <b>1 hour</b></p>`,
    };
    //hash the otp
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOTPVerification = new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdDate: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    // save otp record to db
    await newOTPVerification.save();
    await transporter.sendMail(mailOption);
  } catch (error) {
    console.log('error in sending otp verification email:', error);
    throw error;
  }
};

const uploadCustomerImageMiddleware = imagesUploader('/customer').fields([
  { name: 'image', maxCount: 1 },
]);

const uploadSellerImageMiddleware = imagesUploader('/seller').fields([
  { name: 'image', maxCount: 1 },
]);

router.post(
  '/signup/:userType',
  asyncMiddleware(async (req, res) => {
    const userType = req.params.userType;
    const isCustomer = userType === 'customer';
    if (isCustomer) {
      uploadCustomerImageMiddleware(req, res, async (err) => {
        try {
          if (err)
            return err.code === 'LIMIT_FILE_SIZE'
              ? res.status(400).json({ message: 'File too large. Must be less than 6 Mb' })
              : res.status(400).json({ message: err.message });

          const data = validateCustomer(req.body);
          if (data.error) return res.status(400).json({ message: data.error.details[0].message });

          const customerExists = await Customer.findOne({ email: data.value.email });
          if (customerExists)
            return res.status(400).json({ message: 'Customer with this email already exists' });

          const salt = await bcrypt.genSalt(10);
          const hashedPasword = await bcrypt.hash(data.value.password, salt);

          const payload = {
            ...data.value,
            password: hashedPasword,
          };
          console.log('image', req.files.image);
          if (req.files.image) {
            const customerImage = {
              path: req.files.image[0].path,
              url: customerImageUrl + req.files.image[0].filename,
              filename: req.files.image[0].filename,
            };
            payload.image = customerImage;
          }
          const customer = new Customer(payload);
          try {
            const result = await customer.save();
            await sendOTPVerificationEmail(result, res);
            res.json({ ...result._doc, password: undefined });
          } catch (err) {
            // Delete the record so that user can signup again
            await Customer.deleteOne({ email: payload.email });
            // Delete the file from storage also
            if (payload.image) fs.unlinkSync(payload.image.path);
            return res.status(500).json({ message: 'Error while sendig OTP' });
          }
        } catch (e) {
          console.log(e);
          return res.status(500).json({ message: e.message });
        }
      });
    } else if (userType === 'seller') {
      uploadSellerImageMiddleware(req, res, async (err) => {
        try {
          if (err)
            return err.code === 'LIMIT_FILE_SIZE'
              ? res.status(400).json({ message: 'File too large. Must be less than 200 KB' })
              : res.status(400).json({ message: err.message });

          const data = validateSeller(req.body);
          if (data.error) return res.status(400).json({ message: data.error.details[0].message });

          const sellerExists = await Seller.findOne({ email: data.value.email });
          if (sellerExists)
            return res.status(400).json({ message: 'Seller with this email already exists' });

          const salt = await bcrypt.genSalt(10);
          const hashedPasword = await bcrypt.hash(data.value.password, salt);

          const payload = {
            ...data.value,
            password: hashedPasword,
          };

          if (req.files?.image) {
            const sellerImage = {
              path: req.files.image[0].path,
              url: sellerImageUrl + req.files.image[0].filename,
              filename: req.files.image[0].filename,
            };
            payload.image = sellerImage;
          }

          const seller = new Seller(payload);
          try {
            const result = await seller.save();
            await sendOTPVerificationEmail(result, res);
            res.json({ ...result._doc, password: undefined });
          } catch (err) {
            // Delete the record so that user can signup again
            await Seller.deleteOne({ email: payload.email });
            // Delete the file from storage also
            if (payload.image) fs.unlinkSync(payload.image.path);
            return res.status(500).json({ message: 'Error while sendig OTP' });
          }
        } catch (e) {
          console.log(e);
          return res.status(500).json({ message: e.message });
        }
      });
    } else res.status(400).json({ message: 'Invalid user type' });
  }),
);

const otpSchema = Joi.object({
  userId: Joi.string().required(),
  otp: Joi.string().required(),
  userType: Joi.string().required(),
});
//verify otp
router.post('/verify-otp', async (req, res) => {
  try {
    const data = otpSchema.validate(req.body);
    if (data.error) throw Error(data.error.details[0].message);
    const { userId, otp, userType } = data.value;
    const foundOTP = await UserOTPVerification.findOne({
      userId,
    }).lean();
    if (!foundOTP) throw new Error('Invalid OTP');
    const { expiresAt, otp: hashedOTP } = foundOTP;
    if (expiresAt < Date.now()) {
      await UserOTPVerification.deleteMany({ userId });
      throw new Error('Code has expired, Please request again');
    }
    const validOTP = await bcrypt.compare(otp, hashedOTP);
    if (!validOTP) throw new Error('Invalid code passed, check your email inbox');
    if (userType === 'customer' && validOTP) {
      const cs = await Customer.findOneAndUpdate(
        { _id: userId },
        { $set: { emailVerified: true } },
        { new: true },
      );
      if (!cs) throw new Error('User not found');
      await UserOTPVerification.deleteMany({ userId });
      // sending email
      transporter.sendMail({
        from: process.env.GMAIL,
        to: cs.email,
        subject: 'Thank you for joining JambuSpace',
        html: thankyouEmail(cs.fullName),
      });
      // send success
      return res.json({
        status: 'Verified',
        message: 'Customer Email verified successfully',
      });
    } else if (userType === 'seller' && validOTP) {
      const sl = await Seller.findOneAndUpdate(
        { _id: userId },
        { $set: { emailVerified: true } },
        { new: true },
      );
      if (!sl) throw new Error('User not found');
      await UserOTPVerification.deleteMany({ userId });
      // sending email
      transporter.sendMail({
        from: process.env.GMAIL,
        to: sl.email,
        subject: 'Thank you for joining JambuSpace',
        html: thankyouEmail(sl.fullName),
      });
      // sending success
      return res.json({
        status: 'Verified',
        message: 'Seller Email verified successfully',
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

const resendSchema = Joi.object({
  userId: Joi.string().required(),
  userType: Joi.string().required(),
});
//resend the verification code
router.post('/resend-otp', async (req, res) => {
  try {
    const data = resendSchema.validate(req.body);
    if (data.error) throw new Error(data.error.details[0].message);
    let { userId, userType } = data.value;
    await UserOTPVerification.deleteMany({ userId });
    let foundUser;
    if (userType === 'customer') {
      foundUser = await Customer.findById(userId).lean();
    } else if (userType === 'seller') {
      foundUser = await Seller.findById(userId).lean();
    } else throw new Error('Invalid user type');
    if (foundUser.emailVerified) throw new Error('User already verified');
    await sendOTPVerificationEmail({ _id: userId, email: foundUser.email });
    res.json({ message: 'Email sent' });
  } catch (error) {
    console.log('error in resending otp verification code :', error);
    res.status(500).json({ message: 'Error while resending OTP' });
  }
});

module.exports = router;
