const express = require('express');
const router = express.Router();

const asyncMiddleware = require('../../../middlewares/async');
const validateId = require('../../../middlewares/validateId');

const Conversation = require('../../../models/Conversation');
const Message = require('../../../models/Message');

router.post(
  '/',
  asyncMiddleware(async (req, res) => {
    const conversation = new Conversation({
      members: [req.body.senderID, req.body.receiverID],
    });
    const savedConversation = await conversation.save();
    res.status(200).send(savedConversation);
  }),
);

router.get(
  '/:id',
  validateId,
  asyncMiddleware(async (req, res) => {
    const conversations = await Conversation.find({
      members: { $in: [req.params.id] },
    });
    let modifiedConversations = await Promise.all(
      conversations.map(async (item) => {
        try {
          let messages = await Message.find({
            conversationID: item._id,
          });
          return { ...item.toJSON(), messages: messages };
        } catch (err) {
          throw err;
        }
      }),
    );
    res.json(modifiedConversations);
  }),
);

module.exports = router;
