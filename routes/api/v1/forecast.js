var express = require('express');
var router = express.Router();
var User = require('../../../models').User;
var bcrypt = require('bcrypt');
var saltRounds = 10;
var randomstring = require('randomstring');

// GET forecast for a city
router.get('/', function(req, res, next) {
  User.findAll({where: {api_key: req.body.api_key}})
  .then(user => {
    console.log(req.params);
    if (user != null) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send();//.send(JSON.stringify(weatherResponse));
  } else {
    res.setHeader("Content-Type", "application/json");
    res.status(401).send("Unauthorized");
  }
  })
  .catch(error => {
    res.setHeader("Content-Type", "application/json");
    res.status(500).send({error});
  });
});

module.exports = router;
