const express = require("express");
const {
  getAllUsers,
  getUserById,
  postUser,
  patchUserById,
  deleteUser,
  getEventsByUserId,
  getUserIdByEmail,
} = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);
usersRouter.post("/", postUser);

usersRouter.get("/:user_id", getUserById);
usersRouter.patch("/:user_id", patchUserById);
usersRouter.delete("/:user_id", deleteUser);

usersRouter.get("/:user_id/events", getEventsByUserId);
usersRouter.get("/email/:email", getUserIdByEmail);

module.exports = usersRouter;
