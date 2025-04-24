const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("GET /api/events", () => {
  test("200: Responds with an array containing all event objects", () => {
    return request(app)
      .get("/api/events")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.events)).toBe(true);
      });
  });
  test("200: Responds with all properties of an event object", () => {
    return request(app)
      .get("/api/events")
      .expect(200)
      .then(({ body }) => {
        body.events.forEach((eventObj) => {
          expect(eventObj).toHaveProperty("event_id");
          expect(eventObj).toHaveProperty("event_title");
          expect(eventObj).toHaveProperty("event_date");
          expect(eventObj).toHaveProperty("event_location");
          expect(eventObj).toHaveProperty("event_description");
          expect(eventObj).toHaveProperty("event_img_url");
          expect(eventObj).toHaveProperty("event_created_by");
        });
      });
  });
});

describe("GET /api/events/:event_id", () => {
  test("200: Responds with a single event based on the event_id", () => {
    return request(app)
      .get("/api/events/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.event.event_id).toBe(2);
        expect(body.event.event_title).toBe("Creative Collab");
        expect(body.event.event_date).toBe("2025-06-30T23:00:00.000Z");
        expect(body.event.event_location).toBe("Southbank Centre");
        expect(body.event.event_description).toBe(
          "A gathering for artists, writers, and makers to share and create"
        );
        expect(body.event.event_img_url).toBe(
          "https://t3.ftcdn.net/jpg/03/72/75/95/360_F_372759520_JMN3DwwOUqxXfsCoUJ8rXQ19qXhONws7.jpg"
        );
        expect(body.event.event_created_by).toBe(3);
      });
  });
  test("404: Responds with an error when searching for an event_id that does not exist", () => {
    return request(app)
      .get("/api/events/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Event not found");
      });
  });
  test("400: Responds with an error when searching for an event_id that is not a valid", () => {
    return request(app)
      .get("/api/events/not_valid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/events", () => {
  test("201: Responds with an object containing the new event", () => {
    const newEvent = {
      event_title: "Birthday Party",
      event_date: "2022-02-02",
      event_location: "Farringdon, London",
      event_description: "Partying at Bounce",
      event_img_url:
        "https://cdn.pixabay.com/photo/2015/01/22/00/07/happy-607282_1280.jpg",
      event_created_by: 3,
    };

    return request(app)
      .post("/api/events")
      .send(newEvent)
      .expect(201)
      .then(({ body }) => {
        expect(body.newEvent).toEqual({
          event_id: 7,
          event_title: "Birthday Party",
          event_date: "2022-02-02T00:00:00.000Z",
          event_location: "Farringdon, London",
          event_description: "Partying at Bounce",
          event_img_url:
            "https://cdn.pixabay.com/photo/2015/01/22/00/07/happy-607282_1280.jpg",
          event_created_by: 3,
        });
      });
  });
  test("400: Responds with an error when required fields are missing", () => {
    const newEvent = {
      event_date: "2022-02-02",
      event_location: "Farringdon, London",
      event_description: "Partying at Bounce",
      event_img_url:
        "https://cdn.pixabay.com/photo/2015/01/22/00/07/happy-607282_1280.jpg",
      event_created_by: 3,
    };

    return request(app)
      .post("/api/events")
      .send(newEvent)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "event_title, event_date, event_location, and event_created_by are manditory fields and must be filled with valid data"
        );
      });
  });
  test("400: Responds with an error when references a user that does not exist", () => {
    const newEvent = {
      event_title: "Birthday Party",
      event_date: "2022-02-02",
      event_location: "Farringdon, London",
      event_description: "Partying at Bounce",
      event_img_url:
        "https://cdn.pixabay.com/photo/2015/01/22/00/07/happy-607282_1280.jpg",
      event_created_by: 99999,
    };

    return request(app)
      .post("/api/events")
      .send(newEvent)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("User does not exist");
      });
  });
});

describe("PATCH /api/events/:event_id", () => {
  test("200: Responds with the updated event object", () => {
    const changes = {
      event_title: "Bikini Bottom Auctions",
      event_date: "2025-05-14T23:00:00.000Z",
      event_location: "Art Museum, Bikini Bottom",
      event_description:
        "All the most famous sea creatures are visiting to bid on some luxury items found in this auction",
    };

    return request(app)
      .patch("/api/events/2")
      .send(changes)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedEvent.event_id).toBe(2);
        expect(body.updatedEvent.event_title).toBe("Bikini Bottom Auctions");
        expect(body.updatedEvent.event_date).toBe("2025-05-13T23:00:00.000Z");
        expect(body.updatedEvent.event_location).toBe(
          "Art Museum, Bikini Bottom"
        );
        expect(body.updatedEvent.event_description).toBe(
          "All the most famous sea creatures are visiting to bid on some luxury items found in this auction"
        );
        expect(body.updatedEvent.event_img_url).toBe(
          "https://t3.ftcdn.net/jpg/03/72/75/95/360_F_372759520_JMN3DwwOUqxXfsCoUJ8rXQ19qXhONws7.jpg"
        );
        expect(body.updatedEvent.event_created_by).toBe(3);
      });
  });
  test("404: Responds with an error when searching for an event_id that does not exist", () => {
    const changes = {
      event_title: "Bikini Bottom Auctions",
      event_date: "2025-05-14T23:00:00.000Z",
      event_location: "Art Museum, Bikini Bottom",
      event_description:
        "All the most famous sea creatures are visiting to bid on some luxury items found in this auction",
    };

    return request(app)
      .patch("/api/events/99999")
      .send(changes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Event not found");
      });
  });
  test("400: Responds with an error when searching for an event_id that is not a valid", () => {
    const changes = {
      event_title: "Bikini Bottom Auctions",
      event_date: "2025-05-14T23:00:00.000Z",
      event_location: "Art Museum, Bikini Bottom",
      event_description:
        "All the most famous sea creatures are visiting to bid on some luxury items found in this auction",
    };

    return request(app)
      .patch("/api/events/not_valid")
      .send(changes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: responds with an error when provided with a valid body with invalid values", () => {
    const changes = {
      event_title: 3,
      event_date: 123,
      event_location: 43435,
      event_description: 42455,
    };

    return request(app)
      .patch("/api/events/2")
      .send(changes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/events/:event_id", () => {
  test("204: Removes an event object and responds with no content", () => {
    return request(app).delete("/api/events/2").expect(204);
  });
  test("404: Responds with an error when searching for an event_id that does not exist", () => {
    return request(app)
      .delete("/api/events/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Event not found");
      });
  });
  test("400: Responds with an error when searching for an event_id that is not a valid", () => {
    return request(app)
      .delete("/api/events/not_valid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with all user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        body.users.forEach((user) => {
          expect(user).toHaveProperty("user_id");
          expect(user).toHaveProperty("user_name");
          expect(user).toHaveProperty("user_email");
          expect(user).toHaveProperty("user_avatar_img_url");
          expect(user).toHaveProperty("user_is_staff");
          expect(user).toHaveProperty("user_created_at");
        });
      });
  });
});

describe("GET /api/users/:user_id", () => {
  test("200: Responds with a single user object based on the user_id", () => {
    return request(app)
      .get("/api/users/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.user.user_id).toBe(2);
        expect(body.user.user_name).toBe("Marcus Reed");
        expect(body.user.user_email).toBe("marcus.reed@example.com");
        expect(body.user.user_avatar_img_url).toBe(
          "https://cdn-icons-png.freepik.com/512/6596/6596121.png"
        );
        expect(body.user.user_is_staff).toBe(false);
        expect(typeof body.user.user_created_at).toBe("string");
      });
  });
  test("404: Responds with an error when searching with a user_id that is valid but does not exist", () => {
    return request(app)
      .get("/api/users/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
  test("400: Responds with an error when searching with a user_id that is not valid", () => {
    return request(app)
      .get("/api/users/not_valid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/users", () => {
  test("201: Responds with an object containing the new user", () => {
    const newUser = {
      user_name: "Robert Williams",
      user_email: "newEmail@example.com",
    };

    return request(app)
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.newUser.user_id).toBe(8);
        expect(body.newUser.user_name).toBe("Robert Williams");
        expect(body.newUser.user_email).toBe("newEmail@example.com");
        expect(body.newUser.user_avatar_img_url).toBe(
          "https://cdn-icons-png.freepik.com/512/6596/6596121.png"
        );
        expect(body.newUser.user_is_staff).toBe(false);
        expect(typeof body.newUser.user_created_at).toBe("string");
      });
  });
  test("400: Responds with an error when required fields are missing", () => {
    return request(app)
      .post("/api/users")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "user_name and user_email are manditory fields and must be filled with valid data"
        );
      });
  });
});

describe("PATCH /api/users/:user_id", () => {
  test("200: Responds with the updated user object", () => {
    const changes = {
      user_name: "Mr. Mittens",
      user_avatar_img_url:
        "https://c02.purpledshub.com/uploads/sites/47/2024/02/How-long-do-cats-live.jpg?w=1200",
    };

    return request(app)
      .patch("/api/users/1")
      .send(changes)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedUser.user_id).toBe(1);
        expect(body.updatedUser.user_name).toBe("Mr. Mittens");
        expect(body.updatedUser.user_email).toBe("jessica.tran@example.com");
        expect(body.updatedUser.user_avatar_img_url).toBe(
          "https://c02.purpledshub.com/uploads/sites/47/2024/02/How-long-do-cats-live.jpg?w=1200"
        );
        expect(body.updatedUser.user_is_staff).toBe(false);
        expect(typeof body.updatedUser.user_created_at).toBe("string");
      });
  });
  test("404: Responds with an error when searching for a valid user that does not exist", () => {
    const changes = {
      user_name: "Mr. Mittens",
      user_avatar_img_url:
        "https://c02.purpledshub.com/uploads/sites/47/2024/02/How-long-do-cats-live.jpg?w=1200",
    };

    return request(app)
      .patch("/api/users/9999999")
      .send(changes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
  test("400: Responds with an error when searching for an invalid user", () => {
    const changes = {
      user_name: "Mr. Mittens",
      user_avatar_img_url:
        "https://c02.purpledshub.com/uploads/sites/47/2024/02/How-long-do-cats-live.jpg?w=1200",
    };

    return request(app)
      .patch("/api/users/not_valid")
      .send(changes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error when inputing valid fields with invalid data", () => {
    const changes = {
      user_name: 435,
      user_avatar_img_url: 53,
    };

    return request(app)
      .patch("/api/users/1")
      .send(changes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/users/:user_id", () => {
  test("204: Removes a user object based on its id and responds with no content", () => {
    return request(app).delete("/api/users/4").expect(204);
  });
  test("404: Responds with an error when searching for a valid user that does not exist", () => {
    return request(app)
      .delete("/api/users/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
  test("400: Responds with an error when searching for an invalid user", () => {
    return request(app)
      .delete("/api/users/not_valid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users/:user_id/events", () => {
  test("200: Responds with all events based on the user_id", () => {
    return request(app)
      .get("/api/users/1/events")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.events)).toBe(true);
        body.events.forEach((event) => {
          expect(event).toHaveProperty("event_member_id");
          expect(event).toHaveProperty("event_id");
          expect(event).toHaveProperty("event_title");
          expect(event).toHaveProperty("user_id");
          expect(event).toHaveProperty("event_created_by");
        });
      });
  });
  test("404: Responds with an error when searching for a valid user that does not exist", () => {
    return request(app)
      .get("/api/users/9999999/events")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
  test("400: Responds with an error when searching for an invalid user", () => {
    return request(app)
      .get("/api/users/not_valid/events")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/events/:event_id/tasks", () => {
  test("200: Responds with an array containing all task objects", () => {
    return request(app)
      .get("/api/events/1/tasks")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.tasks)).toBe(true);
        body.tasks.forEach((task) => {
          expect(task).toHaveProperty("task_id");
          expect(task).toHaveProperty("task_title");
          expect(task).toHaveProperty("task_location");
          expect(task).toHaveProperty("task_description");
          expect(task).toHaveProperty("task_start_time");
          expect(task).toHaveProperty("task_end_time");
          expect(task).toHaveProperty("task_img_url");
          expect(task).toHaveProperty("event_id");
        });
      });
  });
  test("404: Responds with an error when searching with a valid event_id that does not exist", () => {
    return request(app)
      .get("/api/events/999999/tasks")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Event not found");
      });
  });
  test("400: Responds with an error when searching with an invalid event_id", () => {
    return request(app)
      .get("/api/events/not_valid/tasks")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/events/:event_id/tasks/:task_id", () => {
  test("200: Responds with a task object based on the task_id", () => {
    return request(app)
      .get("/api/events/1/tasks/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.task.task_id).toBe(1);
        expect(body.task.task_title).toBe("Welcome & Scenic Chill");
        expect(body.task.task_location).toBe(
          "Primrose Hill Entrance (Regent's Park Road)"
        );
        expect(body.task.task_description).toBe(
          "Meet at the bottom of the hill and grab a drink or snack while settling in."
        );
        expect(body.task.task_start_time).toBe("17:00:00");
        expect(body.task.task_end_time).toBe("17:30:00");
        expect(body.task.task_img_url).toBe(
          "https://images.unsplash.com/photo-1587248721893-8e450a3b1f79"
        );
        expect(body.task.event_id).toBe(1);
      });
  });
  test("404: Responds with an error when searching with a valid event_id that does not exist", () => {
    return request(app)
      .get("/api/events/999999/tasks/1")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Event not found");
      });
  });
  test("400: Responds with an error when searching with an invalid event_id", () => {
    return request(app)
      .get("/api/events/not_valid/tasks/1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Responds with an error when searching with a valid task_id that does not exist", () => {
    return request(app)
      .get("/api/events/1/tasks/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Task not found");
      });
  });
  test("400: Responds with an error when searching with an invalid task_id", () => {
    return request(app)
      .get("/api/events/1/tasks/not_valid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/events/:event_id/tasks", () => {
  test("201: Responds with the new task object", () => {
    const newTask = {
      task_title: "Coffee break",
      task_start_time: "13:00",
      task_end_time: "13:15",
    };

    return request(app)
      .post("/api/events/2/tasks")
      .send(newTask)
      .expect(201)
      .then(({ body }) => {
        expect(body.newTask.task_id).toBe(18);
        expect(body.newTask.task_title).toBe("Coffee break");
        expect(body.newTask.task_location).toBe(null);
        expect(body.newTask.task_description).toBe(null);
        expect(body.newTask.task_start_time).toBe("13:00:00");
        expect(body.newTask.task_end_time).toBe("13:15:00");
        expect(body.newTask.task_img_url).toBe(
          "https://cdn5.vectorstock.com/i/1000x1000/73/69/calendar-icon-graphic-design-template-vector-23487369.jpg"
        );
        expect(body.newTask.event_id).toBe(2);
      });
  });
  test("404: Responds with an error when searching with a valid event_id that does not exist", () => {
    const newTask = {
      task_title: "Coffee break",
      task_start_time: "13:00",
      task_end_time: "13:15",
    };

    return request(app)
      .post("/api/events/999999/tasks")
      .send(newTask)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Event not found");
      });
  });
  test("400: Responds with an error when searching with an invalid event_id", () => {
    const newTask = {
      task_title: "Coffee break",
      task_start_time: "13:00",
      task_end_time: "13:15",
    };

    return request(app)
      .post("/api/events/not_valid/tasks")
      .send(newTask)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error when required fields are missing", () => {
    const newTask = {
      task_title: "Coffee break",
      task_end_time: "13:15",
    };

    return request(app)
      .post("/api/events/2/tasks")
      .send(newTask)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "task_title, task_start_time, and task_end_time are madnitory fields and must be filled with valid data"
        );
      });
  });
});

describe("PATCH /api/events/:event_id/tasks/:task_id", () => {
  test("200: Responds with the updated task object", () => {
    const changes = {
      task_title: "Scenic Chill",
      task_start_time: "17:30:00",
      task_end_time: "17:55:00",
      task_description:
        "Meet at the bottom of the hill and grab a drink or snack while settling in. (Delayed to start at 17:30)",
    };

    return request(app)
      .patch("/api/events/1/tasks/1")
      .send(changes)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedTask.task_id).toBe(1);
        expect(body.updatedTask.task_title).toBe("Scenic Chill");
        expect(body.updatedTask.task_location).toBe(
          "Primrose Hill Entrance (Regent's Park Road)"
        );
        expect(body.updatedTask.task_start_time).toBe("17:30:00");
        expect(body.updatedTask.task_end_time).toBe("17:55:00");
        expect(body.updatedTask.task_description).toBe(
          "Meet at the bottom of the hill and grab a drink or snack while settling in. (Delayed to start at 17:30)"
        );
        expect(body.updatedTask.task_img_url).toBe(
          "https://images.unsplash.com/photo-1587248721893-8e450a3b1f79"
        );
        expect(body.updatedTask.task_id).toBe(1);
      });
  });
  test("400: Responds with an error when searching with an invalid event_id", () => {
    const changes = {
      task_title: "Scenic Chill",
      task_start_time: "17:30:00",
      task_end_time: "17:55:00",
      task_description:
        "Meet at the bottom of the hill and grab a drink or snack while settling in. (Delayed to start at 17:30)",
    };

    return request(app)
      .patch("/api/events/not_valid/tasks/1")
      .send(changes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Responds with an error when searching with a valid task_id that does not exist", () => {
    const changes = {
      task_title: "Scenic Chill",
      task_start_time: "17:30:00",
      task_end_time: "17:55:00",
      task_description:
        "Meet at the bottom of the hill and grab a drink or snack while settling in. (Delayed to start at 17:30)",
    };

    return request(app)
      .patch("/api/events/1/tasks/9999999")
      .send(changes)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Task not found");
      });
  });
  test("400: Responds with an error when searching with an invalid task_id", () => {
    const changes = {
      task_title: "Scenic Chill",
      task_start_time: "17:30:00",
      task_end_time: "17:55:00",
      task_description:
        "Meet at the bottom of the hill and grab a drink or snack while settling in. (Delayed to start at 17:30)",
    };

    return request(app)
      .patch("/api/events/1/tasks/not_valid")
      .send(changes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error when using invalid data types", () => {
    const changes = {
      task_title: 78,
      task_start_time: 8,
      task_end_time: 135,
      task_description: 77,
    };

    return request(app)
      .patch("/api/events/1/tasks/1")
      .send(changes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/events/:event_id/tasks/:task_id", () => {
  test("204: removes a task object based on its id and responds with no content", () => {
    return request(app).delete("/api/events/1/tasks/1").expect(204);
  });
  test("404: Responds with an error when searching with a valid event_id that does not exist", () => {
    return request(app)
      .delete("/api/events/999999/tasks/1")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Event not found");
      });
  });
  test("400: Responds with an error when searching with an invalid event_id", () => {
    return request(app)
      .delete("/api/events/not_valid/tasks/1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Responds with an error when searching with a valid task_id that does not exist", () => {
    return request(app)
      .delete("/api/events/1/tasks/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Task not found");
      });
  });
  test("400: Responds with an error when searching with an invalid task_id", () => {
    return request(app)
      .delete("/api/events/1/tasks/not_valid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/events/:event_id/members", () => {
  test("200: Responds with an array containing all event members", () => {
    return request(app)
      .get("/api/events/1/members")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.eventMembers)).toBe(true);
        body.eventMembers.forEach((eventMember) => {
          expect(eventMember).toHaveProperty("event_member_id");
          expect(eventMember).toHaveProperty("event_id");
          expect(eventMember).toHaveProperty("user_id");
        });
      });
  });
  test("404: Responds with an error when searching for an event_id that does not exist", () => {
    return request(app)
      .get("/api/events/99999/members")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Event not found");
      });
  });
  test("400: Responds with an error when searching for an event_id that is not a valid", () => {
    return request(app)
      .get("/api/events/not_valid/members")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/events/:event_id/members", () => {
  test("201: Responds with the new event member", () => {
    const newEventMember = {
      user_id: 5,
    };

    return request(app)
      .post("/api/events/1/members")
      .send(newEventMember)
      .expect(201)
      .then(({ body }) => {
        expect(body.newEventMember.event_member_id).toBe(17);
        expect(body.newEventMember.event_id).toBe(1);
        expect(body.newEventMember.user_id).toBe(5);
      });
  });
  test("404: Responds with an error when searching for an event_id that does not exist", () => {
    const newEventMember = {
      user_id: 5,
    };

    return request(app)
      .post("/api/events/999999/members")
      .send(newEventMember)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Event not found");
      });
  });
  test("400: Responds with an error when searching for an event_id that is not a valid", () => {
    const newEventMember = {
      user_id: 5,
    };

    return request(app)
      .post("/api/events/not_valid/members")
      .send(newEventMember)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an error when required fields are missing", () => {
    return request(app)
      .post("/api/events/1/members")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "User_id is a manditory field and must be filled with valid data"
        );
      });
  });
});
