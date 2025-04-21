const express = require("express");
const { getAllUsers, getUserById } = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);

usersRouter.get("/:user_id", getUserById);

module.exports = usersRouter;
