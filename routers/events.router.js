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
  deleteEventMember,
  getEventMemberById,
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
eventsRouter.delete("/:event_id/members", deleteEventMember);

eventsRouter.get("/:event_id/members/:user_id", getEventMemberById);

module.exports = eventsRouter;
