// Using LottieFiles CDN or other sources
const weatherIconMap = {
    'clear sky': '../assets/sunny.png',
    'light rain': '../assets/rainy.png',
    'overcast clouds': '../assets/cloudy.png',
    'snow': '../assets/snow.png',
    'thunderstorm': '../assets/thunderstorm.png',
    'scattered clouds': '../assets/scattered-clouds.png',
    'few clouds': '../assets/few-clouds.png',
    'mist': '../assets/mist.png',
};


document.addEventListener('DOMContentLoaded', () => {
    const api = {
        key: "YOUR-API-KEY",
        base: "https://api.openweathermap.org/data/2.5/" // Changed to https
    }

    let search = document.getElementById('searchCity');
    if (search) {
        search.addEventListener('keypress', getInput);
    }
    const round = n => Math.round(n * 10) / 10;

    function getInput(e) {
        if (e.key === 'Enter') {
            getResults(search.value);
        }
    }

    function getResults(city) {
        // Use city name directly in the query parameter
        const errorMessage = document.getElementById('error-message');
        errorMessage.classList.remove('visible');
        fetch(`${api.base}weather?q=${city}&units=metric&APPID=${api.key}`)
            .then(async weather => {
                if (!weather.ok) {
                    throw new Error('City not found');
                }
                return await weather.json();
            })
            .then(displayResults)
            .catch(error => {
                console.error('Error:', error);
                showError('City not found. Please try again.');
            });
    }

    function displayResults(weather) {
        let city = document.getElementById('city');
        let temperature = document.getElementById('temperature');
        let minMax = document.getElementById('minMax');
        let icon = document.getElementById('icon'); 
        let condition = document.getElementById('condition');
        let humidity = document.getElementById('humidity');
        let wind = document.getElementById('wind');
        let pressure = document.getElementById('pressure');
        let visibility = document.getElementById('visibility');
        let feelsLike = document.getElementById('feelsLike');
        let clouds = document.getElementById('clouds');
        let iconUrl = '../assets/sunny.png';
        console.log(weather)
        for (const [key, url] of Object.entries(weatherIconMap)) {
            if (weather.weather[0].description.toLowerCase() === key.toLowerCase()) {
                console.log(key, weather.weather[0].description,"jj")
                iconUrl = url;
                break;
            }
        }

        if (city) city.innerText = `${weather.name} ${weather?.sys?.country ? `(, ${weather?.sys?.country})` : ''}`;
        if (temperature) temperature.innerHTML = `${round(weather.main.temp)}<span>°C</span>`;
        if (minMax) minMax.innerText = `H: ${round(weather.main.temp_max)}°C / L: ${round(weather.main.temp_min)}°C`;
        if (icon) icon.setAttribute("src", iconUrl);
        if (condition) condition.innerText = weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1);
        if (humidity) humidity.innerText = `${weather.main.humidity}%`;
        if (wind) wind.innerText = `${weather.wind.speed} m/s`;
        if (pressure) pressure.innerText = `${weather.main.pressure} hPa`;
        if (visibility) visibility.innerText = `${weather.visibility / 1000} km`;
        if (feelsLike) feelsLike.innerText = `${round(weather.main.feels_like)}°C`;
        if (clouds) clouds.innerText = `${weather.clouds.all}%`;
        updateBackgroundBasedOnTime(weather);

    }

    function showError(message) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = message;
        errorMessage.classList.add('visible');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorMessage.classList.remove('visible');
        }, 5000);
    }

    function updateBackgroundBasedOnTime(weather) {
        const body = document.body;
        const now = new Date().getTime() / 1000; // current time in Unix seconds
        const sunrise = weather.sys.sunrise;
        const sunset = weather.sys.sunset;
        const isDaytime = now >= sunrise && now <= sunset;


        if (isDaytime) {
            body.style.background = "linear-gradient(to right, #87CEEB, #B0E2FF)";
        } else {
            body.style.background = "linear-gradient(to right, #0f2027, #203a43, #2c5364)";
        }
    }
});
