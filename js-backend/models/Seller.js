const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const sellerSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  phone: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    required: false,
  },
  image: {
    type: {
      path: {
        type: String,
        required: true,
        default: '',
      },
      url: {
        type: String,
        required: true,
        default: '',
      },
      filename: {
        type: String,
        required: true,
        default: '',
      },
    },
  },
  resume: {
    type: {
      path: {
        type: String,
        required: true,
        default: '',
      },
      url: {
        type: String,
        required: true,
        default: '',
      },
      filename: {
        type: String,
        required: true,
        default: '',
      },
    },
  },
  company: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 0,
  },
  earnings: {
    type: Number,
    default: 0,
  },
  jobs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Jobs',
    default: [],
  },
  bids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Bids',
    default: [],
  },
  about: {
    type: String,
    default: '',
  },
  education: {
    type: [
      {
        school: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        fieldOfStudy: {
          type: String,
          required: true,
        },
        startDate: {
          type: {
            month: {
              type: Number,
              required: true,
            },
            year: {
              type: Number,
              required: true,
            },
          },
        },
        endDate: {
          type: {
            month: {
              type: Number,
              required: true,
            },
            year: {
              type: Number,
              required: true,
            },
          },
        },
      },
    ],
    default: [],
  },
  // subscription is used for job technologies
  subscriptions: {
    type: [String],
    default: [],
  },
  // stripe Connect account id
  stripeId: {
    type: String,
    default: '',
  },
  // only admin can update
  isEnabled: {
    type: Boolean,
    default: false,
  },
});

const validateSeller = function (seller) {
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(255).required(),
    username: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().max(255).required(),
    emailVerified: Joi.bool(),
    password: Joi.string().min(8).max(255).required(),
    city: Joi.string().max(255).required(),
    country: Joi.string().max(255).required(),
    skills: Joi.array().items(Joi.string()),
    phone: Joi.string()
      .regex(new RegExp(`^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$`))
      .required(),
    image: Joi.object({
      path: Joi.string().required(),
      url: Joi.string().required(),
      filename: Joi.string().required(),
    }),
    company: Joi.string().allow(''),
    rating: Joi.number(),
    earnings: Joi.number(),
    jobs: Joi.array().items(Joi.string()),
    bids: Joi.array().items(Joi.string()),
    about: Joi.string(),
    education: Joi.array().items(
      Joi.object({
        school: Joi.string().required(),
        degree: Joi.string().required(),
        fieldOfStudy: Joi.string().required(),
        startDate: Joi.object({
          month: Joi.number().min(1).max(12).required(),
          year: Joi.number().min(1950),
        }),
        endDate: Joi.object({
          month: Joi.number().min(1).max(12).required(),
          year: Joi.number().min(1950),
        }),
        grade: Joi.string().min(1),
        description: Joi.string().min(10).max(255),
      }),
    ),
  });

  return schema.validate(seller, { stripUnknown: true });
};

module.exports = mongoose.model('Sellers', sellerSchema);
module.exports.validateSeller = validateSeller;
