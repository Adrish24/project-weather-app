import { fetchWeather, fetchCity } from "./src/fetcher.js";
import {
  renderSearchHistory,
  renderSearchHistoryList,
  renderSearchResult,
} from "./src/handleSearch.js";

// search bar query selector
const searchBar = document.querySelector("[data-search-container]");
const searchInput = searchBar.querySelector("input");
const searchList = searchBar.querySelector("[data-search-result-list]");
const currentLocation = document.querySelector("[data-current-location]");
const selectUnit = document.querySelector("[data-select-unit]");

let searchHistory;
let currentWeather;
let currentCity = JSON.parse(localStorage.getItem("currentCity")) || "London";
let cityData;
let units = "metric";

// fetch saved weather data on load
window.addEventListener("DOMContentLoaded", async (e) => {
  renderSearchHistoryList();
  cityData = await fetchCity(currentCity);
  // currentWeather = await fetchWeather(cityData[0].lat, cityData[0].lon, units);
  console.log(cityData);
  // console.log(currentWeather);
});

// search city names
searchInput.addEventListener("input", (e) => {
  renderSearchResult(e, searchList);
});

searchInput.addEventListener("focus", (e) => {
  renderSearchHistory(e, searchList);
});

searchInput.addEventListener("blur", () => {
  setTimeout(() => {
    console.log("blur");
    searchInput.value = "";
    searchList.innerHTML = "";
  }, 200);
});

// get current location
currentLocation.addEventListener("click", async (e) => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(lat, lon);
    currentWeather = await fetchWeather(lat, lon, units);
    console.log(units);
    console.log(currentWeather);
  });
});

// set unit type
selectUnit.addEventListener("change", async (e) => {
  units = e.target.value;
  currentWeather = await fetchWeather(cityData[0].lat, cityData[0].lon, units);
  console.log(units);
  console.log(cityData);
  console.log(currentWeather);
});
