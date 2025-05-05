const nodemailer = require("nodemailer");

function createEmail(to, subject, text) {
  if (!to || !subject || !text) {
    return Promise.reject({
      status: 400,
      msg: "Missing required fields",
    });
  }

  if (!to || !/\S+@\S+\.\S+/.test(to)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid email format",
    });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };
  return transporter.sendMail(mailOptions).then((result) => {
    if (result.error) {
      return Promise.reject({
        status: 400,
        msg: "Invalid email format",
      });
    }
    return result;
  });
}

module.exports = {
  createEmail,
};
