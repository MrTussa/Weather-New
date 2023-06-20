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
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&current_weather=true`;
  try {
    const animateMain = document.querySelector(".animate-main") 
    animateMain.classList.add("animate-down")
    const response = await fetch(url);
    const result = await response.json();
    const currentWeather = result.current_weather
    const { temperature, time, windspeed } = currentWeather
    const currId = currTimeId(time, result.hourly.time)
    console.log(result);
    const humidity = result.hourly.relativehumidity_2m[currId]
    weatherFetch(lat, lon)
    showInfo(location, temperature, time, windspeed, humidity)
    dailyTime(result.daily)
    hourlyTime(result.hourly, currId)
    animateMain.classList.remove("animate-down")
    animateMain.classList.add("animate-up")
  } catch (error) {
    console.error(error);
  }
}


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
  const container = document.querySelector(".section-3")
  container.innerHTML = ""
  let obj = ""
  for (let i = counter + 1; i <= counter + 6; i++) {
    obj += `
      <div class="section-3__hourly">
      <p class="section-3__time">${arr.time[i].slice(-5)}</p>
      <p class="section-3__temp">${Math.round(arr.temperature_2m[i])}°</p>
      <div class="section-3__container">
      <p class="section-3__humid">${arr.relativehumidity_2m[i]}%</p> 
          <p class="section-3__wind">${Math.round(arr.windspeed_10m[i])}kpm</p>
          </div>
          <span class="section-3__dec"></span>
          <span class="section-3__dec"></span>
          </div>`
  }
  container.insertAdjacentHTML("afterbegin", obj)
}

function dailyTime(arr) {
  const container = document.querySelector(".weather-cards__container")
  container.innerHTML = ""
  let obj = ""
  for (let i = 0; i <= 6; i++) {
    const time = arr.time[i]
    obj += `
    <div class="weather-cards__daily">
    <p class="weather-cards__time">${time.replace(/-/g, ".")}</p>
    <div class="weather-cards__temp">
    <p class="weather-cards__max">${Math.round(arr.temperature_2m_max[i])}°</p>
    <p class="weather-cards__min">${Math.round(arr.temperature_2m_min[i])}°</p>
    </div>
    <div class="weather-cards__sun-time">
    <div class="weather-cards__desc">
    <p><span><img src="./svg/sunrise-svgrepo-com.svg"></span>sunrice</p>
    <p><span><img src="./svg/sunset-svgrepo-com.svg"></span>sunset</p>
    </div>
    <div class="weather-cards__sun">
          <p>${arr.sunrise[i].slice(-5)}</p>
          <p>${arr.sunset[i].slice(-5)}</p>
          </div>
          </div>
          </div>
          <div class="weather-cards__border"></div>
          `
  }
  container.insertAdjacentHTML("afterbegin", obj)
}



const searchBtn = document.querySelector(".search__button")
const searchBar = document.querySelector(".search__bar")
searchBtn.addEventListener("click", function () {
  getLocation(searchBar.value);
});


searchBar.addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    getLocation(searchBar.value);
  }
});