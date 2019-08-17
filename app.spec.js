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

  test('user can log in', () => {

  });
});
