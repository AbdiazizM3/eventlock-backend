const express = require("express");
const tasksRouter = require("./tasks.router");
const {
  getAllEvents,
  getEvent,
  addEvent,
  patchEvent,
  deleteEvent,
} = require("../controllers/events.controller");

const eventsRouter = express.Router();
eventsRouter.use("/:trip_id/tasks", tasksRouter);

eventsRouter.get("/", getAllEvents);
eventsRouter.post("/", addEvent);

eventsRouter.get("/:event_id", getEvent);
eventsRouter.patch("/:event_id", patchEvent);
eventsRouter.delete("/:event_id", deleteEvent);

module.exports = eventsRouter;
