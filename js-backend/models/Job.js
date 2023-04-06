const mongoose = require('mongoose');
const Joi = require('joi');

const { SellerNotification } = require('./Notification');
const Seller = require('./Seller');
// const Bid = require('./Bid');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    bids: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Bids',
      default: [],
    },
    hiredBid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bids',
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payments',
    },
    sessionId: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    companyMargin: {
      // the company margin can be updated by admin
      // hence updating for every job is not a good way
      // that's why every job will have a company margin
      // value at its creation, and it can be updated if
      // before update the admin updates the margin in
      // admin routes
      type: Number,
      required: true,
      max: 0.95,
    },
    status: {
      type: String,
      required: true,
      default: 'PENDING',
      uppercase: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customers',
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
      default: new Date(),
    },
    duration: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
    },
    technologies: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
      validate: [
        (val) => val.length > 0, // validation function
        'At least one technology is required', // error message
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
        filename: String,
      },
    },
    deliveryDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

const validateJob = function (job) {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    budget: Joi.number().greater(0).required(),
    status: Joi.string().allow('HIRED', 'COMPLETED', 'PENDING', null),
    customer: Joi.string().required(),
    dueDate: Joi.string().required(),
    deliveryDate: Joi.string(),
    duration: Joi.string().required(),
    experienceLevel: Joi.string().required(),
    technologies: Joi.array().items(Joi.string()).required(),
  });

  return schema.validate(job, { stripUnknown: true });
};

jobSchema.post('save', async (doc, next) => {
  try {
    // sending notification to seller
    const sellers = await Seller.find({ subscriptions: { $in: doc.technologies } }).select(
      '_id subscriptions',
    );
    const basePayload = {
      userType: 'seller',
      description: `A new Job is created in ${doc?.technologies?.join()} technologies you may be interested in.`,
      image: doc.image,
    };
    const notifications = sellers.map((s) => ({ ...basePayload, user: s._id.toString() }));
    await SellerNotification.create(notifications);
    const {
      default: { sendNotification },
    } = await import('../index.js');
    sendNotification(basePayload, sellers);
  } catch (e) {
    console.log(e);
  } finally {
    next();
  }
});
/* 
jobSchema.post('updateOne', async (doc, next) => {
  try {
    // sending notification to seller if job is assigned
    if (doc.status !== 'HIRED') return next();
    const foundBid = await Bid.findById(doc.hiredBid);
    if (foundBid) {
      const foundSeller = await Seller.findById(foundBid.seller);
      const basePayload = {
        user: foundSeller._id,
        description: `Congratulations! Your bid for job '${doc.title}' was hired!`,
        image: doc.image,
      };
      await SellerNotification.create(basePayload);
      const {
        default: { sendNotification },
      } = await import('../index.js');
      sendNotification(basePayload, [foundSeller._id]);
    }
  } catch (e) {
    console.log(e);
  } finally {
    next();
  }
}); */

const Job = mongoose.model('Jobs', jobSchema);
module.exports = Job;
module.exports.validateJob = validateJob;
