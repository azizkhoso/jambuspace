const { Router } = require('express');

const Seller = require('../../../models/Seller');
const transport = require('../../../helpers/transport');

const router = new Router();

router.get('/total-count', async (req, res) => {
  try {
    const total = await Seller.count();
    res.json({ total });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const query = Seller.find().select('-password -resume -bids');
    if (req.query.offset) query.skip(Number(req.query.offset));
    query.limit(10).lean();
    const sellers = await query.exec();
    res.json(sellers);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).select('-password').populate('bids');
    res.json(seller);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// enable or disable seller
router.put('/:id/toggle-enabled', async (req, res) => {
  try {
    const found = await Seller.findById(req.params.id);
    if (!found) throw new Error('Seller not found');
    const updated = await Seller.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isEnabled: !found.isEnabled } },
      { new: true },
    )
      .select('-password -resume -jobs -bids')
      .lean();
    transport.sendMail({
      from: process.env.GMAIL,
      to: updated.email,
      subject: updated.isEnabled ? 'Account Enabled' : 'Account Under Review',
      text: updated.isEnabled
        ? 'Your JambuSpace account was enabled after a successfull review'
        : 'Your JambuSpace account is put under review.',
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
