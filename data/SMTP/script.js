var assert = require('assert');
var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: "YourGmailAccount",
        pass: $secure.GMAILAPPPASSWORD
   }
});

var message = {
    from: 'YourGmailAccount',
    to: 'EmailDestinationAccount',
    subject: 'Test message from New Relic Synthetic monitor',
    text: 'Testing the nodemailer package.',
}

transporter.sendMail(message, function(err, info, response){
    assert.ok(!err, "Error sending email: "+err)
})