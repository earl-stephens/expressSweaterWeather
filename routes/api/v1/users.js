var express = require('express');
var router = express.Router();
var User = require('../../../models').User;
var bcrypt = require('bcrypt');
var saltRounds = 10;

/* post new users */
router.post('/', function(req, res, next) {
  User.create({
    email: req.body.email,
    password: req.body.password
  })
  .then(users => {
    res.setHeader('Content-Type', 'application/json');
    res.status(201).send(JSON.stringify(users));
  })
  .catch(error => {
    res.setHeader('Content-Type', 'application/json');
    res.status(500).send({error})
  })
});

module.exports = router;
