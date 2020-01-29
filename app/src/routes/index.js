const express = require('express');
const router = express.Router();
const weatherService = require('../../../weather-service/src/index.js')

/* GET home page. */
router.get('/', async function(req, res, next) {
  const weather = await weatherService.getWeather("KOSU")
  res.render('index', { title: 'Express', weather: weather });
});

module.exports = router;
