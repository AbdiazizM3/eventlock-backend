const format = require("pg-format");
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

function createUser(user_name, user_email) {
  if (!user_name || !user_email) {
    return Promise.reject({
      status: 400,
      msg: "user_name and user_email are manditory fields and must be filled with valid data",
    });
  }
  user_avatar_img_url =
    "https://cdn-icons-png.freepik.com/512/6596/6596121.png";

  const insertQueryStr = format(
    `
    INSERT INTO users
    (user_name, user_email, user_avatar_img_url)
    VALUES
    (%L)
    RETURNING *;
    `,
    [user_name, user_email, user_avatar_img_url]
  );

  return db.query(insertQueryStr).then((result) => {
    return result.rows[0];
  });
}

function updateUserById(user_id, user_name, user_avatar_img_url) {
  if (
    (user_name && typeof user_name !== "string") ||
    (user_avatar_img_url && typeof user_avatar_img_url !== "string")
  ) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `
    UPDATE users
    SET
    user_name = COALESCE($1, user_name),
    user_avatar_img_url = COALESCE($2, user_avatar_img_url)
    WHERE user_id = $3
    RETURNING *;
    `,
      [user_name, user_avatar_img_url, user_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return result.rows[0];
    });
}

module.exports = { fetchAllUsers, fetchUserById, createUser, updateUserById };
