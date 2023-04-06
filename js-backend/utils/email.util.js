require('dotenv').config();
const nodemailer = require('nodemailer');
const pug = require('pug');

let rand;
let host;
let link;

// async..await is not allowed in global scope, must use a wrapper
let nodeMailer = (req, getId) =>
  new Promise((resolve, reject) => {
    try {
      const userName = req.body.email;
      // return
      rand = Math.floor(Math.random() * 100 + 54);
      host = req.get('host');
      link = 'http://' + req.get('host') + '/api/users/verify/' + getId;
      // return
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          type: 'OAuth2',
          user: process.env.GMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
        },
      });
      const html = pug.renderFile(`${__dirname}/../views/email/welcome.pug`, {
        userName,
        link,
      });
      let mailOptions = {
        from: 'social_google@jambuspace.com',
        to: userName,
        subject: 'Email Verification',
        html: html,
      };

      transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
          reject('Email could not sent due to ' + error);
        } else {
          resolve('Email has been sent successfully Please verify Email to get register');
        }
      });
    } catch (error) {
      reject(error);
    }
  });

module.exports = { nodeMailer };
