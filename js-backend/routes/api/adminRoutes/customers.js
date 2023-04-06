const { Router } = require('express');

const Customer = require('../../../models/Customer');
const Job = require('../../../models/Job');
const transport = require('../../../helpers/transport');

const router = new Router();

router.get('/total-count', async (req, res) => {
  try {
    const total = await Customer.count();
    res.json({ total });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const query = Customer.find().select('-password -jobs -bids');
    if (req.query.offset) query.skip(Number(req.query.offset));
    query.limit(10).lean();
    const customers = await query.exec();
    res.json(customers);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select('-password').populate('jobs');
    res.json(customer);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id/jobs/:jobId', async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.jobId, customer: req.params.id });
    res.json(job);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// enable or disable customer
router.put('/:id/toggle-enabled', async (req, res) => {
  try {
    const found = await Customer.findById(req.params.id);
    if (!found) throw new Error('Customer not found');
    const updated = await Customer.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isEnabled: !found.isEnabled } },
      { new: true },
    )
      .select('-password -jobs -bids')
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
