const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        fullName: {
          type: String,
          required: true,
        },
        userType: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    to: {
      type: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        fullName: {
          type: String,
          required: true,
        },
        userType: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Messages', messageSchema);
