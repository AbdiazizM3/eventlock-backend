const express = require("express");
const tasksRouter = require("./tasks.router");
const { getAllEvents, getEvent } = require("../controllers/events.controller");

const eventsRouter = express.Router();
eventsRouter.use("/:trip_id/tasks", tasksRouter);

eventsRouter.get("/", getAllEvents);

eventsRouter.get("/:event_id", getEvent);

module.exports = eventsRouter;
