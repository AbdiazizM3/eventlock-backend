const db = require("../db/connection");

function fetchAllUsers() {
  return db
    .query(
      `
    SELECT * FROM users;
    `
    )
    .then((result) => {
      return result.rows;
    });
}

function fetchUserById(user_id) {
  return db
    .query(
      `
    SELECT * FROM users WHERE user_id = $1
    `,
      [user_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return result.rows[0];
    });
}

module.exports = { fetchAllUsers, fetchUserById };
