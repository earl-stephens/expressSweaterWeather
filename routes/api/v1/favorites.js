var express = require('express');
var router = express.Router();
var User = require('../../../models').User;

// post user favorites
router.post('/', function(req, res, next) {
  User.findOne({where: {api_key: req.body.api_key}})
    .then(users => {
      var comparison = bcrypt.compareSync(req.body.password, users.password);
      if (comparison == true) {
        var apiKeyResponse = {"api_key": users.api_key};
        // part of setting up the session
        /*
        req.session.seenyou = true;
        res.setHeader('X-Seen-You', 'false');
        */
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).send(JSON.stringify(apiKeyResponse));
      }
      else
      {
        res.setHeader("Content-Type", "application/json");
        return res.status(401).send("Unauthorized")
      }
    })
    .catch(error => {
      res.setHeader("Content-Type", "application/json");
      res.status(500).send({error});
    })
  });

module.exports = router;
