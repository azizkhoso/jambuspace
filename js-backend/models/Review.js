const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const reviewSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const validateReview = function (review) {
  const schema = Joi.object({
    author: Joi.string().required(),
    description: Joi.string().required(),
    rating: Joi.number(),
    userID: Joi.string().required(),
  });

  return schema.validate(review);
};

module.exports = mongoose.model("Reviews", reviewSchema);
module.exports.validateReview = validateReview;
