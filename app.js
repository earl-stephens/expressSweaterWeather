var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var namespacedUsersRouter = require('./routes/api/v1/users');
var sessionsRouter = require('./routes/api/v1/sessions');
var forecastRouter = require('./routes/api/v1/forecast');
var favoritesRouter = require('./routes/api/v1/favorites');
var sessions = require('client-sessions');
var randomstring = require('randomstring');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/users', namespacedUsersRouter);
app.use('/api/v1/sessions', sessionsRouter);
app.use('/api/v1/forecast', forecastRouter);
app.use('/api/v1/favorites', favoritesRouter);

/*
This section is an attempt to setup a session
var generatedSecret = randomstring.generate();
app.use(sessions({
  cookieName: 'currentSession',
  secret: "cookieMonster",
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

app.use(function(req, res, next) {
  if (req.session.seenyou) {
    res.setHeader('X-Seen-You', 'true');
  } else {
    req.session.seenyou = true;
    res.setHeader('X-Seen-You', 'false');
  }
});
*/

module.exports = app;
