const {
  fetchAllTasks,
  fetchTask,
  checkIfEventExists,
  createTask,
  updateTask,
  removeTask,
} = require("../models/tasks.model");

function getAllTasks(req, res, next) {
  const { event_id } = req.params;
  checkIfEventExists(event_id)
    .then(() => {
      fetchAllTasks(event_id)
        .then((tasks) => {
          res.status(200).send({ tasks });
        })
        .catch(next);
    })
    .catch(next);
}

function getTask(req, res, next) {
  const { event_id, task_id } = req.params;
  checkIfEventExists(event_id)
    .then(() => {
      fetchTask(task_id, event_id)
        .then((task) => {
          res.status(200).send({ task });
        })
        .catch(next);
    })
    .catch(next);
}

function postTask(req, res, next) {
  const { event_id } = req.params;
  const {
    task_title,
    task_location,
    task_start_time,
    task_end_time,
    task_description,
    task_img_url,
  } = req.body;

  checkIfEventExists(event_id)
    .then(() => {
      createTask(
        event_id,
        task_title,
        task_location,
        task_start_time,
        task_end_time,
        task_description,
        task_img_url
      )
        .then((newTask) => {
          res.status(201).send({ newTask });
        })
        .catch(next);
    })
    .catch(next);
}

function patchTask(req, res, next) {
  const { task_id, event_id } = req.params;
  const {
    task_title,
    task_location,
    task_start_time,
    task_end_time,
    task_description,
    task_img_url,
  } = req.body;
  checkIfEventExists(event_id)
    .then(() => {
      updateTask(
        task_title,
        task_location,
        task_start_time,
        task_end_time,
        task_description,
        task_img_url,
        task_id
      )
        .then((updatedTask) => {
          res.status(200).send({ updatedTask });
        })
        .catch(next);
    })
    .catch(next);
}

function deleteTask(req, res, next) {
  const { task_id, event_id } = req.params;
  checkIfEventExists(event_id)
    .then(() => {
      removeTask(task_id)
        .then(() => {
          res.status(204).send({});
        })
        .catch(next);
    })
    .catch(next);
}

module.exports = { getAllTasks, getTask, postTask, patchTask, deleteTask };
