const { fetchAllEvents, fetchEvent } = require("../models/events.model");

function getAllEvents(req, res, next) {
  fetchAllEvents()
    .then((events) => {
      res.status(200).send({ events });
    })
    .catch(next);
}

function getEvent(req, res, next) {
  const { event_id } = req.params;
  fetchEvent(event_id)
    .then((event) => {
      res.status(200).send({ event });
    })
    .catch(next);
}

module.exports = { getAllEvents, getEvent };
