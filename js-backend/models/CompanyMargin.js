const mongoose = require('mongoose');

const companyMarginSchema = mongoose.Schema({
  margin: {
    type: Number,
    required: true,
    min: 1,
  },
});

module.exports = mongoose.model('CompanyMargin', companyMarginSchema);
