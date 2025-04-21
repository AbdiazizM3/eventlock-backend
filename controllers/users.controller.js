const { fetchAllUsers, fetchUserById } = require("../models/users.model");

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

module.exports = { getAllUsers, getUserById };
