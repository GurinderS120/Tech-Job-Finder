const nodemailer = require("nodemailer");
require("dotenv").config();

// Configurations
const smtpTransport = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false,
  auth: {
    user: "techconsfsu@gmail.com",
    pass: "EUB0cwbyMzNnTmqh",
  },
});

function sendEmail(emailCont) {
  const sendRes = smtpTransport.sendMail({
    from: "techconsfsu@gmail.com", // sender address
    to: emailCont.email, // list of receivers
    subject: emailCont.subject, // Subject line
    html: emailCont.html, // html body
  });
}

module.exports = sendEmail;
