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
