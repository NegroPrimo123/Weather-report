const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Получение погоды по названию города
router.get('/:city', weatherController.getWeatherByCity);

module.exports = router;