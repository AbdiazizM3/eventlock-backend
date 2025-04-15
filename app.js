const express = require("express");
const app = express();
const getEndpoints = require("./controllers/endpoints.controller");

const usersRouter = require("./routers/users.router");
const eventsRouter = require("./routers/events.router");
const tasksRouter = require("./routers/tasks.router");

app.get("/api", getEndpoints);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "404: Not Found" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "400: Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "404: Event or User Not Found" });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
