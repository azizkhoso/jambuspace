const express = require('express');
const Order = require('../../../models/Order');
const Joi = require('joi');

const createOrderSchema = Joi.object({
  description: Joi.string().min(10).required(),
  customer: Joi.string().required(),
  gig: Joi.string().required(),
  status: Joi.string().valid('HIRED', 'COMPLETED', 'REVISION').required(),
  budget: Joi.number().greater(0).required(),
  duration: Joi.date().min('now').required(),
  customerReview: Joi.string(),
  sellerReview: Joi.string(),
});

const updateOrderSchema = Joi.object({
  description: Joi.string().min(10),
  customer: Joi.string(),
  gig: Joi.string(),
  status: Joi.string().valid('HIRED', 'COMPLETED', 'REVISION'),
  budget: Joi.number().greater(0),
  duration: Joi.date().min('now'),
  customerReview: Joi.string(),
  sellerReview: Joi.string(),
});

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.session?.user?._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Some thing went wrong' });
  }
});

// Get a single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.session?.user?._id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Some thing went wrong' });
  }
});

// create an order
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body, customer: req.session?.user?._id };
    // validate request body using createOrderSchema
    const { error } = createOrderSchema.validate(req.body, { abortEary: true, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.details[0].message });
    // create a new Order
    const order = new Order(data);
    // save the order to the database
    await order.save();
    // return the created order
    res.json(order);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

// Update an existing order
router.put('/:id', async (req, res) => {
  try {
    const data = { ...req.body, customer: req.session?.user?._id };
    // validate request body using createOrderSchema
    const { error } = updateOrderSchema.validate(req.body, { abortEary: true, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.details[0].message });
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id },
      { $set: data },
      { $new: true },
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete an order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
