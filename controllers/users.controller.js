const {
  fetchAllUsers,
  fetchUserById,
  createUser,
  updateUserById,
  removeUser,
  fetchEventsByUserId,
  fetchUserIdByEmail,
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

function patchUserById(req, res, next) {
  const { user_id } = req.params;
  const { user_name, user_avatar_img_url, user_is_staff } = req.body;

  updateUserById(user_id, user_name, user_avatar_img_url, user_is_staff)
    .then((updatedUser) => {
      res.status(200).send({ updatedUser });
    })
    .catch(next);
}

function deleteUser(req, res, next) {
  const { user_id } = req.params;
  removeUser(user_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
}

function getEventsByUserId(req, res, next) {
  const { user_id } = req.params;
  fetchEventsByUserId(user_id)
    .then((events) => {
      res.status(200).send({ events });
    })
    .catch(next);
}

function getUserIdByEmail(request, response, next) {
  const { email } = request.params;
  fetchUserIdByEmail(email)
    .then((userId) => {
      response.status(200).send({ userId });
    })
    .catch(next);
}

module.exports = {
  getAllUsers,
  getUserById,
  postUser,
  patchUserById,
  deleteUser,
  getEventsByUserId,
  getUserIdByEmail,
};
