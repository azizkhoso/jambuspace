const express = require('express');
const { CustomerNotification } = require('../../../models/Notification');

// handling seller notifications
const router = express.Router();

router.get('/total-count', async (req, res) => {
  try {
    const total = await CustomerNotification.count({ user: req.session.user._id });
    res.json({ total });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const notifications = await CustomerNotification.find({ user: req.session.user._id });
    res.json(notifications);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// marking a notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const updated = await CustomerNotification.findOneAndUpdate(
      { user: req.session.user._id, _id: req.params.id },
      { $set: { isRead: true } },
      { $new: true },
    );
    if (!updated) throw new Error('Notification not found');
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await CustomerNotification.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
