const db = require("../db/connection");
const format = require("pg-format");

function fetchAllEvents() {
  return db
    .query(
      `
    SELECT * FROM events;
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
    SELECT * FROM events WHERE event_id = $1;
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

async function createEvent(
  event_title,
  event_date,
  event_location,
  event_description,
  event_img_url,
  event_created_by
) {
  if (!event_title || !event_date || !event_location || !event_created_by) {
    return Promise.reject({
      status: 400,
      msg: "event_title, event_date, event_location, and event_created_by are manditory fields and must be filled with valid data",
    });
  }

  const isUserReal = await db.query(
    `
    SELECT * FROM users WHERE user_id = $1;
    `,
    [event_created_by]
  );

  if (isUserReal.rows.length === 0) {
    return Promise.reject({ status: 400, msg: "User does not exist" });
  }
  let insertItemStr = "";

  if (event_description && !event_img_url) {
    insertItemStr += format(
      `
    INSERT INTO events
    (event_title, event_date, event_location, event_description, event_created_by)
    VALUES
    (%L)
    RETURNING *;
    `,
      [
        event_title,
        event_date,
        event_location,
        event_description,
        event_created_by,
      ]
    );
  } else if (!event_description && event_img_url) {
    insertItemStr += format(
      `
    INSERT INTO events
    (event_title, event_date, event_location, event_img_url, event_created_by)
    VALUES
    (%L)
    RETURNING *;
    `,
      [event_title, event_date, event_location, event_img_url, event_created_by]
    );
  } else if (event_description && event_img_url) {
    insertItemStr += format(
      `
    INSERT INTO events
    (event_title, event_date, event_location, event_description, event_img_url, event_created_by)
    VALUES
    (%L)
    RETURNING *;
    `,
      [
        event_title,
        event_date,
        event_location,
        event_description,
        event_img_url,
        event_created_by,
      ]
    );
  } else {
    insertItemStr += format(
      `
    INSERT INTO events
    (event_title, event_date, event_location, event_created_by)
    VALUES
    (%L)
    RETURNING *;
    `,
      [event_title, event_date, event_location, event_created_by]
    );
  }

  return db.query(insertItemStr).then((result) => {
    return result.rows[0];
  });
}

function updateEvent(
  event_id,
  event_title,
  event_date,
  event_location,
  event_description,
  event_img_url
) {
  if (
    (event_title && typeof event_title !== "string") ||
    (event_date && typeof event_date !== "string") ||
    (event_location && typeof event_location !== "string") ||
    (event_description && typeof event_description !== "string") ||
    (event_img_url && typeof event_img_url !== "string")
  ) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `
    UPDATE events
    SET 
        event_title = COALESCE($1, event_title),
        event_date = COALESCE($2, event_date),
        event_location = COALESCE($3, event_location),
        event_description = COALESCE($4, event_description),
        event_img_url = COALESCE($5, event_img_url)
      WHERE event_id = $6
      RETURNING *;
    `,
      [
        event_title,
        event_date,
        event_location,
        event_description,
        event_img_url,
        event_id,
      ]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Event not found" });
      }
      return result.rows[0];
    });
}

function removeEvent(event_id) {
  return db
    .query(
      `
    DELETE FROM events
    WHERE event_id = $1
    RETURNING * ;`,
      [event_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Event not found" });
      }
    });
}

function fetchEventMembers(event_id) {
  return db
    .query(
      `
    SELECT * FROM event_members WHERE event_id = $1;
    `,
      [event_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Event not found" });
      }
      return result.rows;
    });
}

function addEventMember(event_id, user_id) {
  if (!user_id) {
    return Promise.reject({
      status: 400,
      msg: "User_id is a manditory field and must be filled with valid data",
    });
  }

  const insertQueryStr = format(
    `
    INSERT INTO event_members
    (event_id, user_id)
    VALUES
    (%L)
    RETURNING *;
    `,
    [event_id, user_id]
  );

  return db.query(insertQueryStr).then((result) => {
    return result.rows[0];
  });
}

async function checkIfEventExists(event_id) {
  const isEventReal = await db.query(
    `
    SELECT * FROM events WHERE event_id = $1;
    `,
    [event_id]
  );

  if (isEventReal.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Event not found" });
  }
}

function removeEventMember(event_id, user_id) {
  if (!user_id) {
    return Promise.reject({
      status: 400,
      msg: "User_id is a manditory field and must be filled with valid data",
    });
  }

  return db.query(
    `
    DELETE FROM event_members
    WHERE event_id = $1 AND user_id = $2
    RETURNING *;
    `,
    [event_id, user_id]
  );
}

module.exports = {
  fetchAllEvents,
  fetchEvent,
  createEvent,
  updateEvent,
  removeEvent,
  fetchEventMembers,
  addEventMember,
  checkIfEventExists,
  removeEventMember,
};
