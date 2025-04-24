const format = require("pg-format");
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

function createTask(
  event_id,
  task_title,
  task_location,
  task_start_time,
  task_end_time,
  task_description,
  task_img_url
) {
  if (!task_title || !task_start_time || !task_end_time) {
    return Promise.reject({
      status: 400,
      msg: "task_title, task_start_time, and task_end_time are madnitory fields and must be filled with valid data",
    });
  }

  task_img_url =
    task_img_url ||
    "https://cdn5.vectorstock.com/i/1000x1000/73/69/calendar-icon-graphic-design-template-vector-23487369.jpg";

  const insertQueryStr = format(
    `
    INSERT INTO tasks
    (task_title, task_location, task_start_time, task_end_time, task_description, task_img_url, event_id)
    VALUES
    (%L)
    RETURNING *;
    `,
    [
      task_title,
      task_location,
      task_start_time,
      task_end_time,
      task_description,
      task_img_url,
      event_id,
    ]
  );

  return db.query(insertQueryStr).then((result) => {
    return result.rows[0];
  });
}

function updateTask(
  task_title,
  task_location,
  task_start_time,
  task_end_time,
  task_description,
  task_img_url,
  task_id
) {
  if (
    (task_title && typeof task_title !== "string") ||
    (task_location && typeof task_location !== "string") ||
    (task_start_time && typeof task_start_time !== "string") ||
    (task_end_time && typeof task_end_time !== "string") ||
    (task_description && typeof task_description !== "string") ||
    (task_img_url && typeof task_img_url !== "string")
  ) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `
    UPDATE tasks
    SET
    task_title = COALESCE($1, task_title),
    task_location = COALESCE($2, task_location),
    task_start_time = COALESCE($3, task_start_time),
    task_end_time = COALESCE($4, task_end_time),
    task_description = COALESCE($5, task_description),
    task_img_url = COALESCE($6, task_img_url)
    WHERE task_id = $7
    RETURNING *;
    `,
      [
        task_title,
        task_location,
        task_start_time,
        task_end_time,
        task_description,
        task_img_url,
        task_id,
      ]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Task not found" });
      }

      return result.rows[0];
    });
}

module.exports = {
  fetchAllTasks,
  fetchTask,
  checkIfEventExists,
  createTask,
  updateTask,
};
