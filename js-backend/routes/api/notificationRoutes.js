const express = require('express');
const router = express.Router();

const asyncMiddleware = require('../../middlewares/async');

const Notification = require('../../models/Notification');

router.get(
  '/',
  asyncMiddleware(async (_, res) => {
    const response = await Notification.find();
    res.json(response);
  }),
);

module.exports = router;
