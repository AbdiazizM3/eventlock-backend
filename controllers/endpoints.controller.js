const fetchEndpoints = require("../models/endpoints.model");

function getEndpoints(req, res, next) {
  fetchEndPoints()
    .then((endpoint) => {
      res.status(200).send(endpoint);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = getEndpoints;
