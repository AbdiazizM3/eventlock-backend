const {
  fetchAllTasks,
  fetchTask,
  checkIfEventExists,
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

module.exports = { getAllTasks, getTask };
