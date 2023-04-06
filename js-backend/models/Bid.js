const mongoose = require('mongoose');
const Joi = require('joi');

const Job = require('./Job');
const { CustomerNotification } = require('./Notification');

const bidSchema = new mongoose.Schema(
  {
    cover: {
      type: String,
      required: true,
      default: '',
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'PENDING',
      uppercase: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payments',
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sellers',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Jobs',
      required: true,
    },
    duration: {
      type: String,
      required: true,
      default: 'Less than Month',
    },
    milestones: {
      type: [
        {
          description: {
            type: String,
            required: true,
          },
          dueDate: {
            type: String,
            required: true,
          },
          amount: {
            type: String,
            required: true,
          },
        },
      ],
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
        filename: {
          type: String,
          required: true,
        },
      },
      required: false,
    },
  },
  { timestamps: true },
);

const validateBid = function (bid) {
  const schema = Joi.object({
    cover: Joi.string().required(),
    amount: Joi.number().greater(0),
    status: Joi.string().allow('COMPLETED', 'HIRED', 'PENDING', null),
    payment: Joi.string(),
    seller: Joi.string(),
    job: Joi.string().required(),
    duration: Joi.string().required(),
    milestones: Joi.array().items(
      Joi.object({
        description: Joi.string().required(),
        amount: Joi.number().greater(0).required(),
        dueDate: Joi.string().required(),
      }),
    ),
    image: Joi.object({
      path: Joi.string().required(),
      url: Joi.string().required(),
      filename: Joi.string().required(),
    }),
  });

  return schema.validate(bid, { stripUnknown: true });
};

bidSchema.post('save', async (doc, next) => {
  try {
    // sending notification to customer
    const job = await Job.findById(doc.job).select('_id customer');
    const basePayload = {
      description: `New Bid of amount (${doc.amount}) was created for your job.`,
      image: doc.image,
      user: job.customer,
    };
    const notification = await CustomerNotification.create(basePayload);
    const {
      default: { sendNotification },
    } = await import('../index.js');
    sendNotification(basePayload, [{ _id: notification.user }]);
  } catch (e) {
    console.log(e);
  } finally {
    next();
  }
});

module.exports = mongoose.model('Bids', bidSchema);
module.exports.validateBid = validateBid;
