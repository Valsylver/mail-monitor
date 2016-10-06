var nodemailer = require('nodemailer');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

var smtpConfig = require('./mailConfig.js');
var config = require('./config.js');

var transporter = nodemailer.createTransport(smtpConfig);

var sendMailWithAttachment = (fileName) => {
  _.each(config.receivers, receiver => {
    var mailOptions = {
        from: `"${config.sender.name}" <${config.sender.mail}>`,
        to: receiver,
        subject: config.subject,
        text: config.content,
        attachments: [
            {
                path: fileName
            }
         ]
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
  });
}

var getNewestFile = () => {
    var dir = config.directory;
    var files = fs.readdirSync(dir);
    var newest = _.max(_.filter(files, file => file.indexOf(config.fileExtension) !== -1), f => {
        var fullpath = path.join(dir, f);
        return fs.statSync(fullpath).ctime;
    });
    if (newest !== -Infinity) {
      return path.join(dir, newest);
    } else {
      return -Infinity;
    }
}

var newestFile = getNewestFile();
if (newestFile !== -Infinity) {
    sendMailWithAttachment(newestFile);
} else {
    console.log(`No file found in ${config.directory} matching pattern *${config.fileExtension}`);
}
