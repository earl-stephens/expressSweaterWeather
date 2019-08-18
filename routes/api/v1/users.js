var express = require('express');
var router = express.Router();
var User = require('../../../models').User;
var bcrypt = require('bcrypt');
var saltRounds = 10;
var randomstring = require('randomstring');

/* post new users */
router.post('/', function(req, res, next) {
  var hash = bcrypt.hashSync(req.body.password, saltRounds);
  var comparison = bcrypt.compareSync(req.body.password_confirmation, hash);
  if (comparison == true) {
    var generatedKey = randomstring.generate();
    User.create({
      email: req.body.email,
      api_key: generatedKey,
      password: hash
    })
    .then(users => {
      var apiKeyResponse = {"api_key": users.api_key};
      res.setHeader('Content-Type', 'application/json');
      res.status(201).send(JSON.stringify(apiKeyResponse));
    })
    .catch(error => {
      res.setHeader('Content-Type', 'application/json');
      res.status(500).send({error})
    })
  }
  else {
    res.setHeader('Content-Type', 'application/json');
    res.status(401).send({error})
  };
});

module.exports = router;
