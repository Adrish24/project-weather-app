import { fetchWeather, fetchCityByLatAndLon } from "./src/fetcher.js";
import {
  renderSearchHistory,
  renderSearchHistoryList,
  renderSearchResult,
} from "./src/handleSearch.js";
import { renderWeatherData } from "./src/weatherData.js";

// search bar query selector
const searchBar = document.querySelector("[data-search-container]");
const searchInput = searchBar.querySelector("input");
const searchList = searchBar.querySelector("[data-search-result-list]");
const currentLocation = document.querySelector("[data-current-location]");

// fetch saved weather data on load
window.addEventListener("DOMContentLoaded", async (e) => {
  let homeCity = JSON.parse(localStorage.getItem("homeCity")) || null;
  const currentWeather = await fetchWeather(
    homeCity?.lat,
    homeCity?.lon,
    "metric"
  );
  renderSearchHistoryList();
  renderWeatherData(currentWeather, homeCity);
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
    const city = await fetchCityByLatAndLon(lat, lon);
    const currentWeather = await fetchWeather(lat, lon, "metric");
    renderWeatherData(currentWeather, city[0]);
  });
});
