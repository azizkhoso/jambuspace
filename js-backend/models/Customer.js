const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const customerSchema = new Schema({
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
  password: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
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
  company: {
    type: String,
    default: '',
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  spendings: {
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
  // only updated by admin
  isEnabled: {
    type: Boolean,
    default: false,
  },
});

const validateCustomer = function (customer) {
  const schema = Joi.object({
    fullName: Joi.string().min(3).max(255).required(),
    username: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().max(255).required(),
    emailVerified: Joi.bool(),
    password: Joi.string().min(8).max(255).required(),
    city: Joi.string().max(255).required(),
    country: Joi.string().max(255).required(),
    phone: Joi.string()
      .regex(new RegExp(`^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$`))
      .required(),
    image: Joi.object({
      path: Joi.string().required(),
      url: Joi.string().required(),
      filename: Joi.string().required(),
    }),
    company: Joi.string(),
    type: Joi.string(),
    rating: Joi.number(),
    spendings: Joi.number(),
    jobs: Joi.array().items(Joi.string()),
    about: Joi.string(),
  });

  return schema.validate(customer, { stripUnknown: true });
};

module.exports = mongoose.model('Customers', customerSchema);
module.exports.validateCustomer = validateCustomer;
