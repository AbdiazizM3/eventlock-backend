const express = require("express");
const tasksRouter = require("./tasks.router");
const {
  getAllEvents,
  getEvent,
  addEvent,
  patchEvent,
  deleteEvent,
  getEventMembers,
  postEventMember,
} = require("../controllers/events.controller");

const eventsRouter = express.Router();
eventsRouter.use("/:event_id/tasks", tasksRouter);

eventsRouter.get("/", getAllEvents);
eventsRouter.post("/", addEvent);

eventsRouter.get("/:event_id", getEvent);
eventsRouter.patch("/:event_id", patchEvent);
eventsRouter.delete("/:event_id", deleteEvent);

eventsRouter.get("/:event_id/members", getEventMembers);
eventsRouter.post("/:event_id/members", postEventMember);

module.exports = eventsRouter;
