var shell = require('shelljs');
var request = require('supertest');
var app = require('./app');

describe('test the root path', () => {
  test('it should respond to the get method', () => {
    return request(app).get('/').then(response => {
      expect(response.statusCode).toBe(200)
    });
  });
});

// A user can make a post request to
// api/v1/users
// with their email, password, and password confirmation
// in the body of the request as JSON.
// The app will store the information in the database
// and will return a response that contains a
// 201 status code and an API key for that user.

describe('user can make post request', () => {
  test('to create account and get an api key back', () => {
    shell.exec('npx sequelize db:migrate');
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
    shell.exec('npx sequelize db:migrate:undo:all');
  });

  test('to create account and get an api key back', () => {
    shell.exec('npx sequelize db:migrate');
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
    shell.exec('npx sequelize db:migrate:undo:all');
  });
});
