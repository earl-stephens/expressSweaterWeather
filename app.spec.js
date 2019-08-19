var app = require('./app');
var shell = require('shelljs');
var request = require('supertest');

describe('test the root path', () => {
  test('it should respond to the get method', () => {
    return request(app).get('/').then(response => {
      expect(response.statusCode).toBe(200)
    });
  });
});

describe('user can make post request', () => {
  beforeAll(() => {
    shell.exec('npx sequelize db:create');
  });
  beforeEach(() => {
    shell.exec('npx sequelize db:migrate');
    shell.exec('npx sequelize db:seed:all');
  });
  afterEach(() => {
    shell.exec('npx sequelize db:migrate:undo:all');
  });

  test('to create account and get an api key back', () => {
    var body = {"email": "earl@example.com",
                "password": "password",
                "password_confirmation": "password"
                }
      return request(app).post('/api/v1/users')
                       .type('form')
                       .set("Content-Type", "application/json")
                       .send(body)
                       // alternative way of passing body data:
                       // .send({"email": "earl@example.com",
                       //       "password": "password",
                       //       "password_confirmation": "password"})
                       .then(response => {
      expect(response.statusCode).toBe(201);
      expect(Object.keys(response.body)).toContain('api_key')
    });
  });

  test('sad path create account and get an api key back', () => {
    var body = {"email": "earl@example.com",
                "password": "password",
                "password_confirmation": "pw"
                }
      return request(app).post('/api/v1/users')
                       .type('form')
                       .set("Content-Type", "application/json")
                       .send(body)
                       .then(response => {
      expect(response.statusCode).toBe(401)
    });
  });

  test("user can get a city's forecast", () => {
    var body = {"api_key": "1234567890abcdef"}
      return request(app).get('/api/v1/forecast?location=miami,fl')
        .type('form')
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .send(body)
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(Object.keys(response.body["hourly"]["data"][0])).toContain("humidity");
          expect(Object.keys(response.body["daily"]["data"][4])).toContain("temperatureMin");
      })
    });

  test('user can log in', () => {
    var body = {"email": "amy@example.com",
                "password": "password",
                "password_confirmation": "password"
                }
      return request(app).post('/api/v1/users')
                       .type('form')
                       .set("Content-Type", "application/json")
                       .send(body)
                       .then(response => {
      expect(response.statusCode).toBe(201);
    });

    var body2 = {"email": "amy@earl.com",
                "password": "password"
              }
    return request(app).post('/api/v1/sessions')
                        .type('form')
                        .set("Content-Type", "application/json")
                        .send(body2)
                        .then(response => {
      expect(response.statusCode).toBe(200);
      expect(Object.keys(response.body)).toContain('api_key')
    });
  });

  test('user can favorite a location', () => {
    var body = {"api_key": "1234567890abcdef",
                "location": "charleston,sc"
                }
    return request(app).post('/api/v1/favorites')
                        .type('form')
                        .set("Content-Type", "application/json")
                        .send(body)
                        .then(response => {
    expect(response.statusCode).toBe(200);
    expect(Object.key(response.body)).toContain("message")
    });
  });
});
