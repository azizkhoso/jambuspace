const mongoose = require('mongoose');
const { Schema } = mongoose;

const gigSchema = new Schema({
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'Sellers',
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
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
});

module.exports = mongoose.model('Gigs', gigSchema);
