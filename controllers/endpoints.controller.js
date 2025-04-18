const fetchEndpoints = require("../models/endpoints.model");

function getEndpoints(req, res, next) {
  fetchEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch(next);
}

module.exports = getEndpoints;
