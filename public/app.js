document.addEventListener('DOMContentLoaded', function() {
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const weatherContainer = document.getElementById('weatherContainer');
    const errorContainer = document.getElementById('errorContainer');
    const loading = document.getElementById('loading');
    
    const cityName = document.getElementById('cityName');
    const country = document.getElementById('country');
    const weatherDescription = document.getElementById('weatherDescription');
    const weatherIcon = document.getElementById('weatherIcon');
    const temperature = document.getElementById('temperature');
    const feelsLike = document.getElementById('feelsLike');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('windSpeed');
    const clouds = document.getElementById('clouds');
    const dataSource = document.getElementById('dataSource');
    const errorMessage = document.getElementById('errorMessage');
    
    searchBtn.addEventListener('click', fetchWeather);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fetchWeather();
        }
    });
    
    async function fetchWeather() {
        const city = cityInput.value.trim();
        
        if (!city) {
            showError('Please enter a city name');
            return;
        }
        
        loading.classList.remove('hidden');
        weatherContainer.classList.add('hidden');
        errorContainer.classList.add('hidden');
        
        try {
            const response = await fetch(`/weather/${city}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'City not found');
            }
            
            const data = await response.json();
            
            updateWeatherUI(data);
            
            weatherContainer.classList.remove('hidden');
        } catch (error) {
            showError(error.message);
        } finally {
            loading.classList.add('hidden');
        }
    }
    
    function updateWeatherUI(data) {
        const weatherData = data.data;
        const source = data.source;
        
        cityName.textContent = weatherData.name;
        country.textContent = weatherData.sys?.country ? `(${weatherData.sys.country})` : '';
        weatherDescription.textContent = weatherData.weather[0].description;
        
        temperature.textContent = `${Math.round(weatherData.main.temp)}°C`;
        weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        weatherIcon.alt = weatherData.weather[0].description;
        
        feelsLike.textContent = `${Math.round(weatherData.main.feels_like)}°C`;
        humidity.textContent = `${weatherData.main.humidity}%`;
        windSpeed.textContent = `${weatherData.wind.speed} m/s`;
        clouds.textContent = `${weatherData.clouds?.all || 0}%`;
        
        dataSource.textContent = source === 'cache' ? 'Cache' : 'OpenWeatherMap API';
    }
    
    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.classList.remove('hidden');
    }
});