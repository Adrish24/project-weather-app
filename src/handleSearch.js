import { fetchWeather, fetchCity } from "./fetcher.js";
import clearElement from "./clearElement.js";
import { renderWeatherData } from "./weatherData.js";

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
let searchTimeout;
let searchResult = [];
let currentSearchId = 0; //to keep track of the current search

// function to fetch city data
export async function renderSearchResult(e, element) {
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
          searchResult = await fetchCity(searchTerm.toLowerCase(), 5);

          if (searchId !== currentSearchId) return; //if the searchId is not equal to currentSearchId, return

          clearElement(element); //clear prevuious search results

          searchResult = searchResult.filter(
            (city) => city.state !== undefined
          );

          // if there are search results, render them
          if (searchResult.length > 0) {
            const ul = document.createElement("ul");

            ul.className = `py-4`;
            ul.innerHTML = searchResult
              .map(
                (city, index) =>
                  `<li 
                data-city='${JSON.stringify({
                  name: city.name,
                  lat: city.lat,
                  lon: city.lon,
                  state: city.state,
                  country: city.country,
                })}'
                key=${index} 
                class="py-1 px-4 hover:bg-cyan-500 cursor-pointer">
                  <p class="font-semibold w-full truncate">
                    ${city?.name}
                  </p>
                  <p class="text-sm text-gray-800 w-full truncate">
                    ${city.state}, ${city.country}
                  </p>
                </li>`
              )
              .join("");

            ul.addEventListener("click", async (e) => {
              const cityItem = e.target.closest("li");
              if (cityItem && cityItem.dataset.city) {
                const cityData = JSON.parse(cityItem.dataset.city);
                await handleClick(cityData, element);
              }
            });

            element.appendChild(ul);
          } else {
            const ul = document.createElement("ul");

            ul.className = `py-4`;
            ul.innerHTML = `<li class="py-1 px-4">
                  <p class="font-semibold w-full truncate">
                    No results found
                  </p>          
                </li>`;
            element.appendChild(ul);
          }
        } catch (error) {
          console.error("Error fetching data", error);
        }
      } else {
        searchResult = [];
        clearElement(element);
      }
    }
  }, 500);
}

// function to render the search history on search List
// functiong triggered when the imput is empty and on focus
export async function renderSearchHistory(e, element) {
  if (searchHistory.length === 0) return;
  const searchTerm = e.target.value.trim();

  // if the search term is empty, render the search history
  if (searchTerm.length === 0) {
    clearElement(element);
    const ul = document.createElement("ul");

    ul.className = `py-4`;
    ul.innerHTML = searchHistory
      .map(
        (city, index) =>
          `<li 
                data-city='${JSON.stringify({
                  name: city.name,
                  lat: city.lat,
                  lon: city.lon,
                  state: city.state,
                  country: city.country,
                })}'
                key=${index} 
                class="py-1 px-4 hover:bg-cyan-500 cursor-pointer">
                  <p class="font-semibold w-full truncate">
                    ${city?.name}
                  </p>
                  <p class="text-sm text-gray-800 w-full truncate">
                    ${city.state}, ${city.country}
                  </p>
                </li>`
      )
      .join("");

    ul.addEventListener("click", async (e) => {
      const cityItem = e.target.closest("li");
      if (cityItem && cityItem.dataset.city) {
        const cityData = JSON.parse(cityItem.dataset.city);
        handleClick(cityData, element);
      }
    });

    element.appendChild(ul);
  } else {
    clearElement(element);
  }
}

//function to fetch weather data and update the search history for selected city
async function handleClick(city, element) {
  const weatherData = await fetchWeather(city.lat, city.lon, "metric");
  renderWeatherData(weatherData, city);

  if (!searchHistory.some((item) => item.lat === city.lat)) {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }

  searchResult = [];
  clearElement(element);
  renderSearchHistoryList();
}

let isHistoryListenerAttached = false; //to check if the event listener is attached to the search history list
//function to render the search history as list under header
export function renderSearchHistoryList() {
  let homeCity = JSON.parse(localStorage.getItem("homeCity")) || null;

  const searchHistoryContainer = document.querySelector(
    "[data-search-history]"
  );

  if (isHistoryListenerAttached) {
    searchHistoryContainer.removeEventListener(
      "click",
      handleFetchWeatherOrDeleteCityHistory
    );
  }

  // if the search history is empty, hide the search history container
  if (searchHistory.length === 0) {
    searchHistoryContainer.classList.add("hidden");
    return;
  }

  // if the search history is not empty, show the search history container
  searchHistoryContainer.classList.remove("hidden");

  clearElement(searchHistoryContainer);

  // render the search history list
  searchHistoryContainer.innerHTML = searchHistory
    .map(
      (city, index) => `
    <div  key=${index}
          data-city='${JSON.stringify({
            name: city.name,
            lat: city.lat,
            lon: city.lon,
            state: city.state,
            country: city.country,
          })}'
          class="flex items-center bg-cyan-100 hover:bg-cyan-200 py-1 px-2 rounded-sm transition duration-200 ease-in-out cursor-pointer"
        >
          <p class="mr-2 truncate">${city.name}</p>
          ${
            homeCity?.name === city.name
              ? `<div><svg
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
              >
              <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/>
              </svg> 
              </div>`
              : `
            <button
            data-delete
            data-name="${city.name}"
            class="
            px-1.5
            hover:font-semibold 
            hover:bg-cyan-400 active:bg-cyan-400 rounded-sm
            transition duration-200 ease-in-out 
            cursor-pointer"
          >
            ✕
          </button>`
          }
          
        </div>`
    )
    .join("");

  searchHistoryContainer.addEventListener(
    "click",
    handleFetchWeatherOrDeleteCityHistory
  );

  isHistoryListenerAttached = true;
}

// function to handle the click event on the search history list
async function handleFetchWeatherOrDeleteCityHistory(e) {
  if (e.target.hasAttribute("data-delete")) {
    e.stopPropagation();
    const name = e.target.dataset.name;
    searchHistory = searchHistory.filter((city) => city.name !== name);
    renderSearchHistoryList();
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    return;
  }

  const cityItem = e.target.closest("div");
  if (cityItem && cityItem.dataset.city) {
    const cityData = JSON.parse(cityItem.dataset.city);
    const weatherData = await fetchWeather(
      cityData.lat,
      cityData.lon,
      "metric"
    );
    renderWeatherData(weatherData, cityData);
  }
}
