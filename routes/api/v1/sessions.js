var express = require('express');
var router = express.Router();
var User = require('../../../models').User;
var bcrypt = require('bcrypt');
var saltRounds = 10;
var session = require('client-sessions');
var randomstring = require('randomstring');

/* this section is an attempt at creating a session
Keeping this here for future reference
var app = express();
var generatedSecret = randomstring.generate();
app.use(session({
  cookieName: 'session',
  secret: "cookieMonster",
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));
*/

// post user login
router.post('/', function(req, res, next) {
  User.findOne({where: {email: req.body.email}})
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
