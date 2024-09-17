// import { autocomplete } from "./cities";
import { parseDays } from "./js/parsedays.js";
let fiveDayForecastItemTarget;

// autocomplete(document.querySelector("input"), countries);
document.querySelector(".today").style.display = "none";
document.querySelector(".error").style.display = "none";
document.querySelector(".five-day").style.display = "none";
//HEADER + MENU
let degree = "&#176";
let itemsHeaderBottmnMenu = document.querySelectorAll(".item-bottom-menu");
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
document.querySelector("#searchButt").addEventListener("click", searchOnClick);
let fiveDayForecastItems = document.querySelectorAll(".grid-item-five-day ");
for (const e of fiveDayForecastItems) {
  e.addEventListener("click", selectFiveDayItem);
}

function selectFiveDayItem(e) {
  fiveDayForecastItemTarget = e.currentTarget;

  document
    .querySelector(".grid-item-five-day-active")
    .classList.remove("grid-item-five-day-active");
  //add active
  fiveDayForecastItemTarget.classList.add("grid-item-five-day-active");
  //refill table
  fillFiveDayForecastTable(
    forecastObj,
    document.querySelector(".grid-item-five-day-active").id
  );
}

function loadCityInfo() {
  fillToday();
  //
}

function fillToday() {
  let city = document.querySelector("input").value;
  // start fill current weather
  let httpRequest = new XMLHttpRequest();
  httpRequest.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/weather?&appid=9c1ff6247b1e536d7d7e76b09597a61b&q=${city}&units=metric`
  );
  httpRequest.responseType = "json";
  httpRequest.send();
  httpRequest.onload = function (returnedData) {
    if (returnedData.currentTarget.response.cod != 200) {
      document.querySelector(".today").style.display = "none";
      document.querySelector(".error").style.display = "flex";
      return;
    }

    let currentDate = new Date();
    document.querySelector("#currentDate").innerText =
      currentDate.getDate() +
      "-" +
      (currentDate.getMonth() + 1) +
      "-" +
      currentDate.getFullYear();

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
    // start fill hourly and show page
    httpRequest = new XMLHttpRequest();
    httpRequest.open(
      "GET",
      `https://api.openweathermap.org/data/2.5/forecast?&appid=9c1ff6247b1e536d7d7e76b09597a61b&q=${city}&units=metric`
    );
    httpRequest.responseType = "json";
    httpRequest.send();
    httpRequest.onload = function (returnedData) {
      let date = document.querySelectorAll("#day-hourly-table-time");
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
      document.querySelector(".today").style.display = "flex";
    };
  };
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
  let page = e.srcElement.innerText;
  let className = e.srcElement.className;
  if (className == "") {
    className = e.srcElement.parentElement.className;
  }
  // console.log(className.search("active"));
  // console.log(className);

  switch (page) {
    case "5-day forecast":
      if (className.search("active") != -1) {
        console.log("this page alrady active");
        break;
      } else {
        console.log("Load 5-day forecast page");
        changeActiveMenu(e.srcElement);
        document.querySelector(".today").style.display = "none";
        document.querySelector(".error").style.display = "none";
        document.querySelector(".five-day").style.display = "flex";
        fillFiveDayForecast();
        break;
      }
    case "Today":
      if (className.search("active") != -1) {
        console.log("this page alrady active");
        break;
      } else {
        console.log("Load Today page");
        changeActiveMenu(e.srcElement);
        document.querySelector(".today").style.display = "none";
        document.querySelector(".error").style.display = "none";
        document.querySelector(".five-day").style.display = "none";
        fillToday();
        break;
      }

    default:
      break;
  }
}
function searchOnClick(e) {
  let city = document.querySelector("#city").value;
  document.querySelector(".today").style.display = "none";
  document.querySelector(".error").style.display = "none";
  document.querySelector(".five-day").style.display = "none";
  setDefoultActiveMenu();
  fillToday();
}

function changeActiveMenu(params) {
  let item;
  if (params.nodeName == "P") {
    item = params.parentElement;
  }
  if (params.nodeName == "DIV") {
    item = params;
  }
  //remove active
  document.querySelector(".active").classList.remove("active");
  //add active
  item.classList.add("active");
}

function setDefoultActiveMenu() {
  let items = document.querySelectorAll(".item-bottom-menu");
  for (let e of items) {
    e.classList.remove("active");
  }
  items[0].classList.add("active");
}

let selectedDayItem = 0;
let forecastObj;
function fillFiveDayForecast() {
  let city = document.querySelector("#city").value;
  let httpRequest = new XMLHttpRequest();
  httpRequest.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/forecast?&appid=9c1ff6247b1e536d7d7e76b09597a61b&q=${city}&units=metric`
  );
  httpRequest.responseType = "json";
  httpRequest.send();
  httpRequest.onload = function (returnedData) {
    if (returnedData.currentTarget.response.cod != 200) {
      document.querySelector(".today").style.display = "none";
      document.querySelector(".five-day").style.display = "none";
      document.querySelector(".error").style.display = "flex";
      return;
    }
    console.log(returnedData.currentTarget.response.list);

    //parse to OBJByDays
    forecastObj = parseDays(returnedData.currentTarget.response.list);
    console.log(forecastObj);

    //fill DAY OF WEEK
    const dateNow = new Date();
    let day = dateNow.getDay();
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const monthsNames = [
      "JUN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    let dayItems = document.querySelectorAll("#day-of-week");
    for (let e of dayItems) {
      e.innerText = dayNames[day];
      if (day == 6) {
        day = 0;
      } else {
        day += 1;
      }
    }
    //fill date
    let dateFiveDatForecast = document.querySelectorAll(
      "#date-five-dat-forecast"
    );

    Date.prototype.addDays = function (days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };

    for (let i = 0; i < 5; i++) {
      dateFiveDatForecast[i].innerText =
        monthsNames[dateNow.addDays(i).getMonth()] +
        " " +
        dateNow.addDays(i).getDate();
    }

    //fill five datysIcons
    let fiveDayIcons = document.querySelectorAll("#icon-five-forecast");
    for (let i = 0; i < 5; i++) {
      if (i == 0) {
        fiveDayIcons[i].src = `https://openweathermap.org/img/wn/${
          forecastObj[i + 1][0].weather[0].icon
        }@2x.png`;
      } else {
        fiveDayIcons[i].src = `https://openweathermap.org/img/wn/${
          forecastObj[i + 1][4].weather[0].icon
        }@2x.png`;
      }
    }

    //fill five day dergree
    let fiveDayDegree = document.querySelectorAll("#degree-five-forecast");
    for (let i = 0; i < 5; i++) {
      if (i == 0) {
        fiveDayDegree[i].innerHTML =
          Math.round(forecastObj[i + 1][0].main.temp) + `${degree}` + "C";
      } else {
        fiveDayDegree[i].innerHTML =
          Math.round(forecastObj[i + 1][4].main.temp) + `${degree}` + "C";
      }
    }

    //fill weather desc five day
    let weatherDescFiveDay = document.querySelectorAll(
      "#weather-desc-five-forecast"
    );
    for (let i = 0; i < 5; i++) {
      if (i == 0) {
        weatherDescFiveDay[i].innerText = forecastObj[i + 1][0].weather[0].main;
      } else {
        weatherDescFiveDay[i].innerText = forecastObj[i + 1][4].weather[0].main;
      }
    }

    //FILL TABLE
    fillFiveDayForecastTable(
      forecastObj,
      document.querySelector(".grid-item-five-day-active").id
    );
  };
}

function fillFiveDayForecastTable(data, currentTarget) {
  let time = document.querySelectorAll("#selected-item-time");
  let icons = document.querySelectorAll("#selected-item-icon");
  let desc = document.querySelectorAll("#selected-item-desc");
  let temp = document.querySelectorAll("#selected-item-temp");
  let realFeel = document.querySelectorAll("#selected-item-realfeel");
  let wind = document.querySelectorAll("#selected-item-wind");

  let dayItem;
  let isToday = false;
  switch (currentTarget) {
    case "first-item":
      dayItem = data[1];
      isToday = true;
      break;
    case "second-item":
      dayItem = data[2];
      isToday = false;
      break;
    case "third-item":
      dayItem = data[3];
      isToday = false;
      break;
    case "fourth-item":
      dayItem = data[4];
      isToday = false;
      break;
    case "fifth-item":
      dayItem = data[5];
      isToday = false;
      break;
  }

  if (isToday == true) {
    clearFiveDayForecastTable();
    for (let i = 0; i < dayItem.length; i++) {
      time[i].innerText = formatAMPM(new Date(dayItem[i].dt * 1000));

      icons[
        i
      ].src = `https://openweathermap.org/img/wn/${dayItem[i].weather[0].icon}@2x.png`;

      desc[i].innerText = dayItem[i].weather[0].main;

      temp[i].innerHTML = Math.round(dayItem[i].main.temp) + `${degree}` + "c";

      realFeel[i].innerHTML =
        Math.round(dayItem[i].main.feels_like) + `${degree}` + "c";

      let windSpeed = dayItem[i].wind.speed * 3.6;
      wind[i].innerText =
        windSpeed.toFixed(1) + " " + findWindWay(dayItem[i].wind.deg);
    }
  } else {
    clearFiveDayForecastTable();
    for (let i = 0; i < dayItem.length - 2; i++) {
      time[i].innerText = formatAMPM(new Date(dayItem[i + 2].dt * 1000));
      icons[i].src = `https://openweathermap.org/img/wn/${
        dayItem[i + 2].weather[0].icon
      }@2x.png`;
      desc[i].innerText = dayItem[i + 2].weather[0].main;
      temp[i].innerHTML =
        Math.round(dayItem[i + 2].main.temp) + `${degree}` + "c";
      realFeel[i].innerHTML =
        Math.round(dayItem[i + 2].main.feels_like) + `${degree}` + "c";
      let windSpeed = dayItem[i].wind.speed * 3.6;
      wind[i].innerText =
        windSpeed.toFixed(1) + " " + findWindWay(dayItem[i + 2].wind.deg);
    }
  }

  console.log(dayItem);
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + " " + ampm;
  return strTime;
}

function clearFiveDayForecastTable() {
  let time = document.querySelectorAll("#selected-item-time");
  let icons = document.querySelectorAll("#selected-item-icon");
  let desc = document.querySelectorAll("#selected-item-desc");
  let temp = document.querySelectorAll("#selected-item-temp");
  let realFeel = document.querySelectorAll("#selected-item-realfeel");
  let wind = document.querySelectorAll("#selected-item-wind");
  for (const e of time) {
    e.innerText = "";
  }
  for (const e of icons) {
    e.src = "";
  }
  for (const e of desc) {
    e.innerText = "";
  }
  for (const e of temp) {
    e.innerHTML = "";
  }
  for (const e of realFeel) {
    e.innerHTML = "";
  }
  for (const e of wind) {
    e.innerText = "";
  }
}
