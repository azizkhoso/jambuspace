const express = require('express');

const Job = require('../../../models/Job');

// this router is for accessing jobs publically by sellers
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'PENDING' })
      .select('-payment')
      .populate('cutomer')
      .lean();
    res.json(jobs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .select('-payment')
      .populate('customer bids')
      .lean();
    if (!job) throw { message: 'Job not found', status: 404 };
    res.json(job);
  } catch (e) {
    res.status(e.status || 500).json({ message: e.message });
  }
});

module.exports = router;
