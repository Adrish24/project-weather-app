import { fetchWeather, fetchCity } from "./src/fetcher.js";

// search bar query selector
const searchBar = document.querySelector("[data-search-container]");
const searchInput = searchBar.querySelector("input");
const searchList = searchBar.querySelector("[data-search-result-list]");
const currentLocation = document.querySelector("[data-current-location]");
const selectUnit = document.querySelector("[data-select-unit]");

let currentWeather;
let currentCity = JSON.parse(localStorage.getItem("currentCity")) || "London";
let selectedCity;
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
let cityData;
let units = "metric";

// fetch saved weather data on load
window.addEventListener("DOMContentLoaded", async (e) => {
  cityData = await fetchCity(currentCity);
  //   currentWeather = await fetchWeather(cityData[0].lat, cityData[0].lon, units);
  console.log(cityData);
  //   console.log(currentWeather);
});

// search city names

searchInput.addEventListener("input", handleSearchResult);

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

// clear element function
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// function to fetch city data
let searchTimeout;
let currentSearchId = 0; //to keep track of the current search
async function handleSearchResult(e) {
  const searchTerm = e.target.value.trim();

  if (searchTimeout) {
    clearTimeout(searchTimeout); //clear the previouse timeout
  }

  const searchId = ++currentSearchId; // incremenet the searchId to track the current search

  //   debounce the search
  searchTimeout = setTimeout(async () => {
    if (searchId === currentSearchId) {
      // if the searchId is equal to currentSearchId, proceed
      if (searchTerm.length > 0) {
        try {
          const searchResult = await fetchCity(searchTerm.toLowerCase(), 5);

          if (searchId !== currentSearchId) return; //if the searchId is not equal to currentSearchId, return

          clearElement(searchList); //clear prevuious search results

          searchResult = searchResult.filter(
            (city) => city.state !== undefined
          );

          if (searchResult.length > 0) {
            const ul = document.createElement("ul");

            ul.className = `py-4`;
            ul.innerHTML = searchResult
              .map(
                (city, index) =>
                  `<li key=${index} class="py-1 px-4 hover:bg-cyan-500 cursor-pointer">
                  <p class="font-semibold w-full truncate">
                    ${city?.name}
                  </p>
                  <p class="text-sm text-gray-800 w-full truncate">
                    ${city.state}, ${city.country}
                  </p>
                </li>`
              )
              .join("");
            searchList.appendChild(ul);
          }
        } catch (error) {
          console.error("Error fetching data", error);
        }
      } else {
        searchResult = [];
        clearElement(searchList);
      }
    }
  }, 500);
}
