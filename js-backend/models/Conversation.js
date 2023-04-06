const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    users: {
      type: [
        {
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
      ],
      required: true,
      minLength: 2,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Conversations', conversationSchema);
