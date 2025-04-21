const express = require("express");
const {
  getAllUsers,
  getUserById,
  postUser,
  patchUserById,
} = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);
usersRouter.post("/", postUser);

usersRouter.get("/:user_id", getUserById);
usersRouter.patch("/:user_id", patchUserById);

module.exports = usersRouter;
