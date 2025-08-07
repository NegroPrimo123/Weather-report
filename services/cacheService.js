const pool = require('../db');

exports.getCachedWeather = async (city) => {
  const query = `
    SELECT data FROM cached_weather 
    WHERE city = $1 AND expires_at > NOW()
    ORDER BY timestamp DESC 
    LIMIT 1
  `;
  
  const { rows } = await pool.query(query, [city.toLowerCase()]);
  return rows[0];
};

exports.cacheWeatherData = async (city, data) => {
  const ttl = parseInt(process.env.CACHE_TTL) || 3600;
  const expiresAt = new Date(Date.now() + ttl * 1000);
  
  const query = `
    INSERT INTO cached_weather (city, country, data, expires_at)
    VALUES ($1, $2, $3, $4)
  `;
  
  await pool.query(query, [
    city.toLowerCase(),
    data.sys?.country || '',
    data,
    expiresAt
  ]);
};

exports.cleanupExpiredCache = async () => {
  await pool.query('DELETE FROM cached_weather WHERE expires_at <= NOW()');
};

// Очистка кеша каждые 6 часов
setInterval(this.cleanupExpiredCache, 6 * 60 * 60 * 1000);