const express = require('express');
const cors = require('cors');

// Auth Routes
const authRoutes = require('../routes/api/auth');

// Page Routes
const SellerRoutes = require('../routes/api/sellerRoutes');
const CustomerRoutes = require('../routes/api/customerRoutes');
const AdminRoutes = require('../routes/api/adminRoutes');

// Website Routes
const ClientConversations = require('../routes/api/websiteRoutes/conversationRoutes');
const ClientMessages = require('../routes/api/websiteRoutes/messageRoutes');
const NotificationRoutes = require('../routes/api/notificationRoutes');
const technologiesRoutes = require('../routes/api/technologyRoutes');

// Error Routes
const error = require('../middlewares/error');

const verifySellerLogin = (req, res, next) => {
  if (!(req?.session?.user?.userType === 'seller')) {
    return res.status(403).json({ message: 'Not logged in' });
  } else if (!req?.session?.user?.isEnabled) {
    return res.status(403).json({ message: 'User not enabled' });
  } else {
    next();
  }
};

const verifyCustomerLogin = (req, res, next) => {
  if (!(req?.session?.user?.userType === 'customer')) {
    return res.status(403).json({ message: 'Not logged in' });
  } else if (!req?.session?.user?.isEnabled) {
    return res.status(403).json({ message: 'User not enabled' });
  } else {
    next();
  }
};

const verifyAdminLogin = (req, res, next) => {
  if (!(req?.session?.user?.userType === 'admin')) {
    return res.status(403).json({ message: 'Not logged in' });
  } else {
    next();
  }
};

module.exports = function (app) {
  app.use(
    cors({
      origin: 'http://localhost:3000',
      // the authentication and authorization is handled using express-session
      // the session is sending a cookie to frontend
      // to get the cookie back, withCredentials in axios should be true
      // and the alternative should be used for fetch
      // the whole process will work when credentials is set to true, as below
      credentials: true, // needs to be true in order to handle session cookie
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('./public'));

  // Pages Routes
  app.use('/api/sellers', verifySellerLogin, SellerRoutes);
  app.use('/api/customers', verifyCustomerLogin, CustomerRoutes);
  app.use('/api/notifications', NotificationRoutes);

  app.use('/api/auth', authRoutes);

  // Website Routes
  app.use('/api/conversations', ClientConversations);
  app.use('/api/messages', ClientMessages);
  app.use('/api/technologies', technologiesRoutes);

  // Admin Routes
  app.use('/api/admin', verifyAdminLogin, AdminRoutes);

  // Error Logging
  app.use(error);
};
