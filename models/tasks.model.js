const db = require("../db/connection");

function fetchAllTasks(event_id) {
  return db
    .query(
      `
    SELECT * FROM tasks WHERE event_id = $1;
    `,
      [event_id]
    )
    .then((result) => {
      return result.rows;
    });
}

function fetchTask(task_id, event_id) {
  return db
    .query(
      `
    SELECT * FROM tasks WHERE task_id = $1 AND event_id = $2
    `,
      [task_id, event_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Task not found" });
      }
      return result.rows[0];
    });
}

async function checkIfEventExists(event_id) {
  const isEventReal = await db.query(
    `SELECT * FROM events WHERE event_id = $1;`,
    [event_id]
  );

  if (isEventReal.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Event not found" });
  }
}

module.exports = { fetchAllTasks, fetchTask, checkIfEventExists };
