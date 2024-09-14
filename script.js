// import { autocomplete } from "./cities";
// autocomplete(document.querySelector("input"), countries);
//HEADER + MENU
let degree = "&#176";
let itemsHeaderBottmnMenu = document.querySelectorAll(".item");
for (const e of itemsHeaderBottmnMenu) {
  e.addEventListener(
    "mouseover",
    (event) => {
      // highlight the mouseenter target
      if (event.target.localName == "p") {
        event.target.parentNode.style.color = "purple";
        event.target.parentNode.style.backgroundColor = "white";
      } else {
        event.target.style.color = "purple";
        event.target.style.backgroundColor = "white";
      }
    },
    false
  );
  e.addEventListener(
    "mouseout",
    (event) => {
      // highlight the mouseout target
      event.target.style.color = "";
      event.target.style.backgroundColor = "";
    },
    false
  );
  e.addEventListener("click", changePage);
}
document.addEventListener("DOMContentLoaded", loadCityInfo);
function loadCityInfo() {
  fillToday();
  //
}

function fillToday() {
  let city = document.querySelector("input").value;
  let httpRequest = new XMLHttpRequest();
  httpRequest.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/weather?&appid=9c1ff6247b1e536d7d7e76b09597a61b&q=${city}s&units=metric`
  );
  httpRequest.responseType = "json";
  httpRequest.send();
  httpRequest.onload = function (returnedData) {
    if (returnedData.currentTarget.response.cod == 404) return;

    // start fill Current Weather
    document.querySelector(
      "#currentWeatherIcon"
    ).src = `https://openweathermap.org/img/wn/${returnedData.currentTarget.response.weather[0].icon}@2x.png`;
    document.querySelector("#currentWeatherDesc").innerText =
      returnedData.currentTarget.response.weather[0].main;
    document.querySelector("#temp").innerHTML =
      Math.round(returnedData.currentTarget.response.main.temp) +
      `${degree}` +
      "C";
    document.querySelector("#feelsLike").innerHTML =
      "Real Feel " +
      Math.round(returnedData.currentTarget.response.main.feels_like) +
      `${degree}`;
    document.querySelector("#currentWeather-sunrise").innerText =
      "Sunrise: " + getTime(returnedData.currentTarget.response.sys.sunrise);
    document.querySelector("#currentWeather-sunset").innerText =
      "Sunset: " + getTime(returnedData.currentTarget.response.sys.sunset);
    document.querySelector("#currentWeather-sunDuration").innerText =
      "Duration: " +
      getDurationHours(
        returnedData.currentTarget.response.sys.sunrise,
        returnedData.currentTarget.response.sys.sunset
      ) +
      " hours";
    // end fill Current Weather
    httpRequest = new XMLHttpRequest();
    httpRequest.open(
      "GET",
      `https://api.openweathermap.org/data/2.5/forecast?&appid=9c1ff6247b1e536d7d7e76b09597a61b&q=${city}&units=metric`
    );
    httpRequest.responseType = "json";
    httpRequest.send();
    httpRequest.onload = function (returnedData) {
      if (returnedData.currentTarget.response.cod == 404) return;
      let date = document.querySelectorAll(".day-hourly-table-time-item");
      let icons = document.querySelectorAll("#day-hourly-table-icon");
      let forecast = document.querySelectorAll("#day-hourly-table-forecast");
      let temp = document.querySelectorAll("#day-hourly-table-Temp");
      let realFeel = document.querySelectorAll("#day-hourly-table-feelslike");
      let wind = document.querySelectorAll("#day-hourly-table-wind");

      for (let i = 0; i < date.length; i++) {
        date[i].innerText =
          returnedData.currentTarget.response.list[i].dt_txt.slice(5);
        icons[
          i
        ].src = `https://openweathermap.org/img/wn/${returnedData.currentTarget.response.list[i].weather[0].icon}@2x.png`;
        forecast[i].innerText =
          returnedData.currentTarget.response.list[i].weather[0].main;
        temp[i].innerHTML =
          Math.round(returnedData.currentTarget.response.list[i].main.temp) +
          `${degree}` +
          "c";
        realFeel[i].innerHTML =
          Math.round(
            returnedData.currentTarget.response.list[i].main.feels_like
          ) +
          `${degree}` +
          "c";

        let windSpeed =
          returnedData.currentTarget.response.list[i].wind.speed * 3.6;
        wind[i].innerText =
          windSpeed.toFixed(1) +
          " " +
          findWindWay(returnedData.currentTarget.response.list[i].wind.deg);
      }
    };
    //start fill hourly
  };
  let currentDate = new Date();
  document.querySelector("#currentDate").innerText =
    currentDate.getDate() +
    "-" +
    (currentDate.getMonth() + 1) +
    "-" +
    currentDate.getFullYear();
}

function getTime(eObj) {
  let mEpoch = eObj;
  if (mEpoch < 10000000000) mEpoch *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
  let dDate = new Date();
  dDate.setTime(mEpoch);

  return dDate.getHours() + ":" + dDate.getMinutes();
}
function getDurationHours(firstTime, secondTime) {
  let mEpoch = firstTime;
  if (mEpoch < 10000000000) mEpoch *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
  let dDate1 = new Date();
  dDate1.setTime(mEpoch);

  mEpoch = secondTime;
  if (mEpoch < 10000000000) mEpoch *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
  let dDate2 = new Date();
  dDate2.setTime(mEpoch);

  let hours = dDate2.getHours() - dDate1.getHours();

  return hours;
}
function findWindWay(deg) {
  let windDirection = [
    { way: "NE", min: 24, max: 68 },
    { way: "E", min: 69, max: 113 },
    { way: "SE", min: 114, max: 158 },
    { way: "S", min: 159, max: 203 },
    { way: "SW", min: 204, max: 248 },
    { way: "W", min: 249, max: 293 },
    { way: "NW", min: 294, max: 336 },
  ];

  let searchRes = windDirection.find((element) => {
    if (element.min <= deg && element.max >= deg) {
      return true;
    }
    return false;
  });

  if (searchRes) return searchRes.way;
  else return "N";
}

function changePage(e) {
  console.log("changePage", e.srcElement);
}
