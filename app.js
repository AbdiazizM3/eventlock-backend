const express = require("express");
const app = express();
const getEndpoints = require("./controllers/endpoints.controller");

const usersRouter = require("./routers/users.router");
const eventsRouter = require("./routers/events.router");
const { postEmail } = require("./controllers/email.controller");

app.use(express.json());

app.get("/api", getEndpoints);
app.use("/api/events", eventsRouter);
app.use("/api/users", usersRouter);
app.post("/api/send-email", postEmail);

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "server error" });
});

module.exports = app;
