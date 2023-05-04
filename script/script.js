// const url = 'https://weatherapi-com.p.rapidapi.com/forecast.json?q=London&days=7';
// const options = {
// 	method: 'GET',
// 	headers: {
// 		'X-RapidAPI-Key': 'e6fcb91f62msh00399125f4d9165p18917fjsn45cd1ef84581',
// 		'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
// 	}
// };

// fetch(url, options)
// .then()

async function getWeather(location) {

  const url =
    `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&days=7`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "e6fcb91f62msh00399125f4d9165p18917fjsn45cd1ef84581",
      "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
getWeather("Samarkand")