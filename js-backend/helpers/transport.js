require('dotenv').config();
const nodemailer = require('nodemailer');

//nodemailer stuff
const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

module.exports = transport;
