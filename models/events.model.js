const db = require("../db/connection");

function fetchAllEvents() {
  return db
    .query(
      `
    SELECT * FROM events
    `
    )
    .then((result) => {
      return result.rows;
    });
}

function fetchEvent(event_id) {
  return db
    .query(
      `
    SELECT * FROM events WHERE event_id = $1
    `,
      [event_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Event not found" });
      }
      return result.rows[0];
    });
}

module.exports = { fetchAllEvents, fetchEvent };
