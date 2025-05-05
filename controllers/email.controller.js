const { createEmail } = require("../models/email.model");

function postEmail(req, res, next) {
  const { to, subject, text } = req.body;
  createEmail(to, subject, text)
    .then((data) => {
      res.status(200).send({ success: true, data });
    })
    .catch(next);
}

module.exports = {
  postEmail,
};
