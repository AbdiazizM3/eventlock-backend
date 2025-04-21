const {
  fetchAllUsers,
  fetchUserById,
  createUser,
} = require("../models/users.model");

function getAllUsers(req, res, next) {
  fetchAllUsers().then((users) => {
    res.status(200).send({ users });
  });
}

function getUserById(req, res, next) {
  const { user_id } = req.params;

  fetchUserById(user_id)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
}

function postUser(req, res, next) {
  const { user_name, user_email } = req.body;
  createUser(user_name, user_email)
    .then((newUser) => {
      res.status(201).send({ newUser });
    })
    .catch(next);
}

module.exports = { getAllUsers, getUserById, postUser };
