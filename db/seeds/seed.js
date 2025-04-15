const format = require("pg-format");
const db = require("../connection");

const seed = ({ userData, eventsData, eventMembersData, tasksData }) => {
  return db
    .query(`DROP TABLE IF EXISTS events CASCADE`)
    .then(() => db.query(`DROP TABLE IF EXISTS users CASCADE`))
    .then(() => db.query(`DROP TABLE IF EXISTS event_members CASCADE`))
    .then(() => db.query(`DROP TABLE IF EXISTS tasks CASCADE`))
    .then(() => {
      return db.query(`
        CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        user_name VARCHAR NOT NULL,
        user_email VARCHAR UNIQUE,
        user_avatar_img_url VARCHAR,
        user_is_staff BOOLEAN DEFAULT FALSE,
        user_created_at TIMESTAMP DEFAULT NOW()
        );
        `);
    })
    .then(() => {
      return db.query(`
          CREATE TABLE events (
          event_id SERIAL PRIMARY KEY,
          event_title VARCHAR(100) NOT NULL,
          event_date DATE NOT NULL,
          event_location VARCHAR NOT NULL,
          event_description TEXT,
          event_img_url VARCHAR,
          event_created_by INT REFERENCES users(user_id) ON DELETE CASCADE
          );
          `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE event_members (
        event_member_id SERIAL PRIMARY KEY,
        event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        UNIQUE (trip_id, user_id)
        );
        `);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE tasks (
        task_id SERIAL PRIMARY KEY,
        task_title VARCHAR NOT NULL,
        task_location VARCHAR NOT NULL,
        task_description TEXT,
        task_start_time TIME,
        task_end_time TIME,
        task_img_url VARCHAR,
        event_id INT REFERENCES events(event_id) ON DELETE CASCADE
        );
        `);
    })
    .then(() => {
      const insertUserQueryStr = format(
        "INSERT INTO users (user_name, user_email, user_avatar_img_url, user_is_staff, user_created_at) VALUES %L;",
        userData.map(
          ({
            user_name,
            user_email,
            user_avatar_img_url,
            user_is_staff,
            user_created_at,
          }) => [
            user_name,
            user_email,
            user_avatar_img_url,
            user_is_staff,
            user_created_at,
          ]
        )
      );

      return db.query(insertUserQueryStr);
    })
    .then(() => {
      const insertEventQueryStr = format(
        "INSERT INTO events (event_title, event_date, event_location, event_description, event_img_url, event_created_by) VALUES %L;",
        eventsData.map(
          ({
            event_title,
            event_date,
            event_location,
            event_description,
            event_img_url,
            event_created_by,
          }) => [
            event_title,
            event_date,
            event_location,
            event_description,
            event_img_url,
            event_created_by,
          ]
        )
      );

      return db.query(insertEventQueryStr);
    })
    .then(() => {
      const insertTaskQueryStr = format(
        "INSERT INTO tasks (task_title, task_location, task_description, task_start_time, task_end_time, task_img_url, event_id) VALUES %L;",
        tasksData.map(
          ({
            task_title,
            task_location,
            task_description,
            task_start_time,
            task_end_time,
            task_img_url,
            event_id,
          }) => [
            task_title,
            task_location,
            task_description,
            task_start_time,
            task_end_time,
            task_img_url,
            event_id,
          ]
        )
      );

      return db.query(insertTaskQueryStr);
    })
    .then(() => {
      const insertEventMembersQueryStr = format(
        "INSERT INTO event_members (event_id, user_id) VALUES %L;",
        eventMembersData.map(({ event_id, user_id }) => [event_id, user_id])
      );

      return db.query(insertEventMembersQueryStr);
    });
};

module.exports = seed;
