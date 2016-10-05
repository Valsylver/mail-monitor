var nodemailer = require('nodemailer');
var smtpConfig = require('./mailConfig.js');
var argumentParser = require("node-argument-parser");

var argv = argumentParser.parse("./arguments.json", process);

console.log(`"${argv.sender}" <${argv.senderMail}>`);

var transporter = nodemailer.createTransport(smtpConfig);

var mailOptions = {
    from: `"${argv.sender}" <${argv.senderMail}>`,
    to: argv.receiver,
    subject: argv.subject,
    text: argv.content
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});