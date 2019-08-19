var express = require('express');
var router = express.Router();
var User = require('../../../models').User;
var Location = require('../../../models').Location;

// post user favorites
router.post('/', function(req, res, next) {
  console.log(req.body);
  User.findOne({where: {api_key: req.body.api_key}})
    .then(users => {
      Location.create({
        name: req.body.location,
        UserId: users.id
      })
      .then(users => {
        var messageResponse = {"message": `${req.body.location} has been added to your favorites`};
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(JSON.stringify(messageResponse));
      })
    })
    .catch(error => {
      res.setHeader("Content-Type", "application/json");
      res.status(401).send({error});
    })
  });

module.exports = router;
