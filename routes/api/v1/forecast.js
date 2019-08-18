var express = require('express');
var router = express.Router();
var User = require('../../../models').User;
var bcrypt = require('bcrypt');
var saltRounds = 10;
var randomstring = require('randomstring');
require('dotenv').config();
var fetch = require('node-fetch');

// GET forecast for a city
router.get('/', function(req, res, next) {
  User.findAll({where: {api_key: req.body.api_key}})
  .then(user => {
    if (user != null) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_KEY}&address=${req.query.location}`)
      .then(res => res.json())
      .then(json => {
        var body = (`${json.results[0].geometry.location.lat},${json.results[0].geometry.location.lng}`);
        fetch(`https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${body}`)
        .then(res => res.json())
        .then(json =>{
          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(JSON.stringify(json))
        });
      });
      //.send(JSON.stringify(weatherResponse));
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
