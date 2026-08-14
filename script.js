const inputBox = document.querySelector('.input-box');
const searchBtn = document.getElementById('searchBtn');

const weather_img = document.querySelector('.weather-img');
const temperature = document.querySelector('.temperature');
const description = document.querySelector('.description');
const humidity = document.getElementById('humidity');
const wind_speed = document.getElementById('wind-speed');

const location_not_found = document.querySelector('.location-not-found');
const weather_body = document.querySelector('.weather-body');


async function checkWeather(city) {

    // Prevent empty searches
    if (!city.trim()) {
        return;
    }

    try {

        // --------------------------------------------------
        // STEP 1: Convert city name to latitude/longitude
        // --------------------------------------------------

        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search` +
            `?name=${encodeURIComponent(city)}` +
            `&count=1` +
            `&language=en` +
            `&format=json`;

        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) {
            throw new Error("Failed to find location");
        }

        const geoData = await geoResponse.json();

        // No location found
        if (!geoData.results || geoData.results.length === 0) {

            location_not_found.style.display = "flex";
            weather_body.style.display = "none";

            console.log("Location not found");

            return;
        }


        // Get coordinates
        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        console.log("Location:", location.name);
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);


        // --------------------------------------------------
        // STEP 2: Get weather using coordinates
        // --------------------------------------------------

        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
            `&temperature_unit=celsius` +
            `&wind_speed_unit=kmh`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error("Failed to get weather data");
        }

        const weatherData = await weatherResponse.json();

        console.log("Weather data:", weatherData);


        // --------------------------------------------------
        // STEP 3: Display weather
        // --------------------------------------------------

        location_not_found.style.display = "none";
        weather_body.style.display = "flex";


        const current = weatherData.current;


        // Temperature
        temperature.innerHTML =
            `${Math.round(current.temperature_2m)}°C`;


        // Weather description
        description.innerHTML =
            getWeatherDescription(current.weather_code);


        // Humidity
        humidity.innerHTML =
            `${current.relative_humidity_2m}%`;


        // Wind speed
        wind_speed.innerHTML =
            `${Math.round(current.wind_speed_10m)}Km/H`;


        // Weather image
        weather_img.src =
            getWeatherImage(current.weather_code);

    }
    catch (error) {

        console.error("Weather error:", error);

        location_not_found.style.display = "flex";
        weather_body.style.display = "none";
    }
}


// --------------------------------------------------
// Convert Open-Meteo weather code to description
// --------------------------------------------------

function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1) {
        return "Mainly clear";
    }

    if (code === 2) {
        return "Partly cloudy";
    }

    if (code === 3) {
        return "Overcast";
    }

    if ([45, 48].includes(code)) {
        return "Fog";
    }

    if ([51, 53, 55].includes(code)) {
        return "Drizzle";
    }

    if ([56, 57].includes(code)) {
        return "Freezing drizzle";
    }

    if ([61, 63, 65].includes(code)) {
        return "Rain";
    }

    if ([66, 67].includes(code)) {
        return "Freezing rain";
    }

    if ([71, 73, 75, 77].includes(code)) {
        return "Snow";
    }

    if ([80, 81, 82].includes(code)) {
        return "Rain showers";
    }

    if ([85, 86].includes(code)) {
        return "Snow showers";
    }

    if ([95].includes(code)) {
        return "Thunderstorm";
    }

    if ([96, 99].includes(code)) {
        return "Thunderstorm with hail";
    }

    return "Unknown";
}


// --------------------------------------------------
// Choose image based on Open-Meteo weather code
// --------------------------------------------------

function getWeatherImage(code) {

    // Clear
    if (code === 0 || code === 1) {
        return "/assets/clear.png";
    }

    // Cloudy
    if (code === 2 || code === 3) {
        return "/assets/cloud.png";
    }

    // Fog
    if (code === 45 || code === 48) {
        return "/assets/mist.png";
    }

    // Rain / drizzle
    if (
        [51, 53, 55, 56, 57, 61, 63, 65,
         66, 67, 80, 81, 82].includes(code)
    ) {
        return "/assets/rain.png";
    }

    // Snow
    if (
        [71, 73, 75, 77, 85, 86].includes(code)
    ) {
        return "/assets/snow.png";
    }

    // Thunderstorm
    if (
        [95, 96, 99].includes(code)
    ) {
        return "/assets/cloud.png";
    }

    // Default
    return "/assets/cloud.png";
}


// --------------------------------------------------
// Search button
// --------------------------------------------------

searchBtn.addEventListener('click', () => {

    checkWeather(inputBox.value);

});


// --------------------------------------------------
// Allow pressing Enter
// --------------------------------------------------

inputBox.addEventListener('keypress', (event) => {

    if (event.key === 'Enter') {
        checkWeather(inputBox.value);
    }

});