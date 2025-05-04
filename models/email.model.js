function createEmail(to, subject, text, html) {
  if (!to || !subject || (!text && !html)) {
    return Promise.reject({
      status: 400,
      msg: "to, subject, text and html are all manditory fields that must be filled with valid data",
    });
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(to)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid email format. Must be like email@example.com",
    });
  }

  return global.resend.emails
    .send({
      from: "your-verified-domain@resend.dev",
      to,
      subject,
      text,
      html,
    })
    .then((result) => {
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
