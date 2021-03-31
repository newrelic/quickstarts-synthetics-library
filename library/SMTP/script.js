const assert = require('assert');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: 'YourGmailAccount',
    pass: $secure.GMAILAPPPASSWORD,
  },
});

const message = {
  from: 'YourGmailAccount',
  to: 'EmailDestinationAccount',
  subject: 'Test message from New Relic Synthetic monitor',
  text: 'Testing the nodemailer package.',
};

transporter.sendMail(message, function (err, info, response) {
  assert.ok(!err, `Error sending email: ${err}`);
  console.log('info', info);
  console.log('response', response);
});
