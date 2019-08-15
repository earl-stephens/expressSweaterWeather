var express = require('express');
var router = express.Router();
var User = require('../../../models').User;
var bcrypt = require('bcrypt');
var saltRounds = 10;
var randomstring = require('randomstring');

/* post new users */
router.post('/', function(req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash){
    var generatedKey = randomstring.generate();
    User.create({
      email: req.body.email,
      api_key: generatedKey,
      password: hash
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
});

module.exports = router;
