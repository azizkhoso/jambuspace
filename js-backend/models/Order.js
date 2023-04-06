const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customers',
      required: true,
    },
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gigs',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['HIRED', 'COMPLETED', 'REVISION'],
    },
    budget: {
      type: Number,
      required: true,
      min: 1,
    },
    duration: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= Date.now();
        },
        message: 'Duration should be in future time',
      },
    },
    customerReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reviews',
      required: false,
    },
    sellerReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reviews',
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Orders = mongoose.model('Orders', OrderSchema);

module.exports = Orders;
