var express = require('express');
var router = express.Router();
var User = require('../../../models').User;
var bcrypt = require('bcrypt');
var saltRounds = 10;
var randomstring = require('randomstring');
require('dotenv').config();
var fetch = require('node-fetch');
var wxData = require('../../../serializers/weather_serializer.js');

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
        .then(json => {
          var locale = {"location": req.query.location};
          var wxCurrent = {
            "currently": {
              "summary": json.currently.summary,
              "icon": json.currently.icon,
              "precipIntensity": json.currently.precipIntensity,
              "precipProbability": json.currently.precipProbability,
              "temperature": json.currently.temperature,
              "humidity": json.currently.humidity,
              "pressure": json.currently.pressure,
              "windSpeed": json.currently.windSpeed,
              "windGust": json.currently.windGust,
              "windBearing": json.currently.windBearing,
              "cloudCover": json.currently.cloudCover,
              "visibility": json.currently.visibility
            }
          };
          var hourlyData = json.hourly.data.slice(0, 9);
          var dataPoints = [];
          for (let element in hourlyData) {
            dataPoints.push({
            "time": hourlyData[element].time,
            "summary": hourlyData[element].summary,
            "icon": hourlyData[element].icon,
            "precipIntensity": hourlyData[element].precipIntensity,
            "precipProbability": hourlyData[element].precipProbability,
            "temperature": hourlyData[element].temperature,
            "humidity": hourlyData[element].humidity,
            "pressure": hourlyData[element].pressure,
            "windSpeed": hourlyData[element].windSpeed,
            "windGust": hourlyData[element].windGust,
            "windBearing": hourlyData[element].windBearing,
            "cloudCover": hourlyData[element].cloudCover,
            "visibility": hourlyData[element].visibility
            });
          };
          var wxHourly = {
            "hourly": {
              "summary": json.hourly.summary,
              "icon": json.hourly.icon,
              "data": dataPoints
            }
          };
          var dailyData = json.daily.data;
          var dailyDataPoints = [];
          for (let element in dailyData) {
            dailyDataPoints.push({
            "time": dailyData[element].time,
            "summary": dailyData[element].summary,
            "icon": dailyData[element].icon,
            "sunriseTime": dailyData[element].sunriseTime,
            "sunsetTime": dailyData[element].sunsetTime,
            "precipIntensity": dailyData[element].precipIntensity,
            "precipIntensityMax": dailyData[element].precipIntensityMax,
            "precipIntensityMaxTime": dailyData[element].precipIntensityMaxTime,
            "precipProbability": dailyData[element].precipProbability,
            "precipType": dailyData[element].precipType,
            "temperatureHigh": dailyData[element].temperatureHigh,
            "temperatureLow": dailyData[element].temperatureLow,
            "humidity": dailyData[element].humidity,
            "pressure": dailyData[element].pressure,
            "windSpeed": dailyData[element].windSpeed,
            "windGust": dailyData[element].windGust,
            "cloudCover": dailyData[element].cloudCover,
            "visibility": dailyData[element].visibility,
            "temperatureMin": dailyData[element].temperatureMin,
            "temperatureMax": dailyData[element].temperatureMax
            });
          };
          var wxDaily = {
            "daily": {
              "summary": json.daily.summary,
              "icon": json.daily.icon,
              "data": dailyDataPoints
            }
          };
          var allData = {...locale, ...wxCurrent, ...wxHourly, ...wxDaily};
          return allData;
        })
        .then(data => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).send(JSON.stringify(data))
        });
      });
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
