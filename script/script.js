async function getLocation(location) {
  const url =
    `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`;
  try {
    const response = await fetch(url);
    const result = await response.json();
    console.log(result.results[0].longitude);
    getWeather(result.results[0].latitude, result.results[0].longitude, location)
  } catch (error) {
    console.error(error);
  }
}

async function getWeather(lat, lon, location) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&current_weather=true`;
  try {
    const response = await fetch(url);
    const result = await response.json();
    const currentWeather = result.current_weather
    const { temperature, time, windspeed } = currentWeather
    const currId = currTimeId(time, result.hourly.time)
    console.log(result.hourly);
    const humidity = result.hourly.relativehumidity_2m[currId]
    weatherFetch(lat, lon)
    showInfo(location, temperature, time, windspeed, humidity)
    hourlyTime(result.hourly, currId)
  } catch (error) {
    console.error(error);
  }
}
getLocation("Samarkand")


function showInfo(location, temperature, currTime, windspeed, humidity) {
  const city = document.querySelector(".section-1__forecast")
  const time = document.querySelector(".section-1__time")
  const temp = document.querySelector(".section-1__temperature")
  const humid = document.querySelector(".section-1__humidity")
  const wind = document.querySelector(".section-1__wind")
  city.textContent = location
  temp.textContent = Math.round(temperature) + "°"
  time.textContent = currTime.slice(-5)
  humid.textContent = "Humid: " + humidity + "%"
  wind.textContent = Math.round(windspeed) + "kmp"
}

function currTimeId(currTime, time) {
  for (let i = 0; i <= 23; i++) {
    if (currTime === time[i]) {
      return i
    }
  }
}
async function weatherFetch(lat, lon) {
  const response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=693538282fd2a9a570d852f1db2eda50&units=metric"
  )
  const data = await response.json();
  const { icon, description } = data.weather[0];
  const weather = document.querySelector(".section-1__weather")
  const iconPlace = document.querySelector(".section-1__icon")
  weather.textContent = description
  iconPlace.src = `https://openweathermap.org/img/wn/${icon}@2x.png`
}

function hourlyTime(arr, counter) {
  let obj
  for(let i = counter; i <= counter+8; i++) {
    obj += ``
  }
}