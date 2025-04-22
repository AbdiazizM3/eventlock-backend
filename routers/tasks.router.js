const express = require("express");
const { getAllTasks, getTask } = require("../controllers/tasks.controller");

const tasksRouter = express.Router({ mergeParams: true });

tasksRouter.get("/", getAllTasks);

tasksRouter.get("/:task_id", getTask);

module.exports = tasksRouter;
