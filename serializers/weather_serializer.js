var express = require('express');
var fetch = require('node-fetch');
require('dotenv').config();


function getData(location) {
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_KEY}&address=${location}`)
  .then(res => res.json())
  .then(json => {
    var body = (`${json.results[0].geometry.location.lat},${json.results[0].geometry.location.lng}`);
    fetch(`https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${body}`)
    .then(res => res.json())
    .then(json => JSON.stringify(json))
  });
};

module.exports = getData;
