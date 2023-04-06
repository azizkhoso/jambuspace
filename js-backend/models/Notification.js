const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    image: {
      type: {
        path: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        filename: String,
      },
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model('Notification', NotificationSchema);

const SellerNotification = Notification.discriminator(
  'SellerNotification',
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
    },
  }),
);

const CustomerNotification = Notification.discriminator(
  'CustomerNotification',
  new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
  }),
);

module.exports = Notification;
module.exports.SellerNotification = SellerNotification;
module.exports.CustomerNotification = CustomerNotification;
