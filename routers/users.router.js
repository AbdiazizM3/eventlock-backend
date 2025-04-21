const express = require("express");
const {
  getAllUsers,
  getUserById,
  postUser,
} = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);
usersRouter.post("/", postUser);

usersRouter.get("/:user_id", getUserById);

module.exports = usersRouter;
