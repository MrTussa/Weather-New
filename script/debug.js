let city, time, temp, humid, wind, animateMain, weather, iconPlace, containerSection3, containerWeatherCards;
 window.onload = function() {
  city = document.querySelector(".section-1__forecast");
  time = document.querySelector(".section-1__time");
  temp = document.querySelector(".section-1__temperature");
  humid = document.querySelector(".section-1__humidity");
  wind = document.querySelector(".section-1__wind");
  animateMain = document.querySelector(".animate-main");
  weather = document.querySelector(".section-1__weather");
  iconPlace = document.querySelector(".section-1__icon");
  containerSection3 = document.querySelector(".section-3");
  containerWeatherCards = document.querySelector(".weather-cards__container");
}
 async function getLocation(location) {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch location');
    const result = await response.json();
    if (!result.results[0]) throw new Error('No location found');
    getWeather(result.results[0].latitude, result.results[0].longitude, location);
  } catch (error) {
    console.error(error);
  }
}
 async function getWeather(lat, lon, location) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&current_weather=true`;
  try {
    animateMain.classList.add("animate-down");
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch weather');
    const result = await response.json();
    const currentWeather = result.current_weather;
    const { temperature, time, windspeed } = currentWeather;
    const currId = currTimeId(time, result.hourly.time);
    const humidity = result.hourly.relativehumidity_2m[currId];
    weatherFetch(lat, lon);
    showInfo(location, temperature, time, windspeed, humidity);
    dailyTime(result.daily);
    hourlyTime(result.hourly, currId);
    animateMain.classList.remove("animate-down");
    animateMain.classList.add("animate-up");
  } catch (error) {
    console.error(error);
  }
}
 function showInfo(location, temperature, currTime, windspeed, humidity) {
  city.textContent = location;
  temp.textContent = Math.round(temperature) + "°";
  time.textContent = currTime.slice(-5);
  humid.textContent = "Humid: " + humidity + "%";
  wind.textContent = Math.round(windspeed) + "kmp";
}
 function currTimeId(currTime, time) {
  return time.indexOf(currTime);
}
 // Remaining code...