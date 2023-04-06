const express = require('express');

const Technology = require('../../models/Technology');

// this router is for accessing technologies publically without authentication
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const technologies = await Technology.find().lean();
    res.json(technologies);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
