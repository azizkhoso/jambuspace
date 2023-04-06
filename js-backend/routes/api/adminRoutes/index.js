const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const CompanyMargin = require('../../../models/CompanyMargin');
const Admin = require('../../../models/Admin');
const Technology = require('../../../models/Technology');
const sellers = require('./sellers');
const customers = require('./customers');

// adding test admin profile
async function addTestAdmin() {
  try {
    const adminCount = await Admin.count();
    if (adminCount > 0) return;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('12345678', salt);
    const admin = await Admin.create({ email: 'admin@jambuspace.com', password: hashedPassword });
    console.log('Test admin', admin);
  } catch (e) {
    console.log('Test Admin failed', e.message);
  }
}
addTestAdmin();

const router = express.Router();

// seller routes for admin
router.use('/sellers', sellers);
// customer routes for admin
router.use('/customers', customers);

router.put('/company-margin', async (req, res) => {
  try {
    const updatedCompanyMargin = await CompanyMargin.updateMany(
      {},
      { margin: req.body.margin },
      { new: true },
    ).lean();
    res.json(updatedCompanyMargin);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get('/company-margin', async (req, res) => {
  try {
    const companyMargin = await CompanyMargin.findOne({});
    res.json(companyMargin);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put('/update-profile', async (req, res) => {
  try {
    if (!req.body.password) throw new Error('Password is required');
    const admin = await Admin.findById(req.session?.user?._id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    const salt = await bcrypt.genSalt(10);
    const hashedPasword = await bcrypt.hash(req.body.password, salt);
    const updatedAdmin = await Admin.findOneAndUpdate(
      { _id: req.session?.user?._id },
      { $set: { email: req.body.email, password: hashedPasword } },
      { new: true },
    ).select('-password');
    req.session.user.email = updatedAdmin.email;
    res.json(updatedAdmin);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

const technologySchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  skills: Joi.array().items(Joi.string()),
});
router.post('/technologies', async (req, res) => {
  try {
    const data = technologySchema.validate(req.body, { stripUnknown: true });
    if (data.error) throw new Error(data.error.details[0].message);
    const technology = await Technology.create(data.value);
    res.json(technology);
  } catch (e) {
    if (e.code === 11000) {
      res.status(400).json({ message: 'Technology already exists' });
    } else res.status(400).json({ message: e.message });
  }
});

router.get('/technologies', async (req, res) => {
  try {
    const technologies = await Technology.find().lean();
    res.json(technologies);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

const updateSchema = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  skills: Joi.array().items(Joi.string()).optional(),
  active: Joi.bool().optional(),
});
router.put('/technologies/:id', async (req, res) => {
  try {
    const data = updateSchema.validate(req.body, { stripUnknown: true });
    if (data.error) throw new Error(data.error.details[0].message);
    const foundTechnology = await Technology.findById(req.params.id).lean();
    if (!foundTechnology) throw new Error('Technology not found');
    let newSkills;
    if (data.value?.skills) {
      newSkills = new Set([...foundTechnology.skills, ...data.value.skills]); // removing duplicate values
    } else {
      newSkills = foundTechnology.skills;
    }
    const payload = data.value;
    payload.skills = Array.from(newSkills);
    const updatedTechnology = await Technology.findOneAndUpdate(
      { _id: req.params.id },
      { $set: payload },
      { new: true },
    );
    res.json(updatedTechnology);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/technologies/:id', async (req, res) => {
  try {
    const result = await Technology.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
