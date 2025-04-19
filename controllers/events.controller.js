const {
  fetchAllEvents,
  fetchEvent,
  createEvent,
  updateEvent,
  removeEvent,
} = require("../models/events.model");

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

function addEvent(req, res, next) {
  const {
    event_title,
    event_date,
    event_location,
    event_description,
    event_img_url,
    event_created_by,
  } = req.body;

  createEvent(
    event_title,
    event_date,
    event_location,
    event_description,
    event_img_url,
    event_created_by
  )
    .then((newEvent) => {
      res.status(201).send({ newEvent });
    })
    .catch(next);
}

function patchEvent(req, res, next) {
  const { event_id } = req.params;
  const {
    event_title,
    event_date,
    event_location,
    event_description,
    event_img_url,
  } = req.body;

  updateEvent(
    event_id,
    event_title,
    event_date,
    event_location,
    event_description,
    event_img_url
  )
    .then((updatedEvent) => {
      res.status(200).send({ updatedEvent });
    })
    .catch(next);
}

function deleteEvent(req, res, next) {
  const { event_id } = req.params;
  removeEvent(event_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
}

module.exports = { getAllEvents, getEvent, addEvent, patchEvent, deleteEvent };
