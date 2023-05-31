const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // /create a transporter
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    // using mailtrap.io
    host: process.env.Email_Host,
    port: process.env.Email_Port,
    auth: {
      user: process.env.Email_Username,
      pass: process.env.Email_Password,
    },
  });

  //   test
  transporter.verify(function (error, success) {
    error ? console.log(error) : console.log('mailer is ready to send mail');
  });

  // define email options
  const mailOptions = {
    from: 'Panagea <admin@panagea.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
