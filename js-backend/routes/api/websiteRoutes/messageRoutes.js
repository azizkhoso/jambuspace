const express = require('express');
const router = express.Router();

const asyncMiddleware = require('../../../middlewares/async');
const validateId = require('../../../middlewares/validateId');

const Message = require('../../../models/Message');
const { validateMessage } = require('../../../models/Message');

router.post(
  '/',
  asyncMiddleware(async (req, res) => {
    const { error } = validateMessage(req.body);
    if (error) return res.status(400).json({ message: 'Invalid Message' });

    const message = new Message(req.body);
    const savedMessage = await message.save();
    res.json(savedMessage);
  }),
);

router.get(
  '/:conversationID',
  validateId,
  asyncMiddleware(async (req, res) => {
    const messages = await Message.find({
      conversationID: req.params.conversationID,
    });
    res.json(messages);
  }),
);

module.exports = router;
