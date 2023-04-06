const mongoose = require('mongoose');

const TechnologySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  skills: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('Technology', TechnologySchema);
