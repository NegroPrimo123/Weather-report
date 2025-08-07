const cacheService = require('../services/cacheService');
const weatherService = require('../services/weatherService');

exports.getWeatherByCity = async (req, res) => {
  try {
    const { city } = req.params;
    
    // Проверяем кеш
    const cachedData = await cacheService.getCachedWeather(city);
    
    if (cachedData) {
      return res.json({
        source: 'cache',
        data: cachedData.data
      });
    }
    
    const weatherData = await weatherService.fetchWeatherFromAPI(city);
    
    await cacheService.cacheWeatherData(city, weatherData);
    
    res.json({
      source: 'api',
      data: weatherData
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'City not found' });
  }
};