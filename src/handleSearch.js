import { fetchWeather, fetchCity } from "./fetcher.js";
import clearElement from "./clearElement.js";



let selectedCity;
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
let searchTimeout;
let searchResult = [];
let currentSearchId = 0; //to keep track of the current search


// function to fetch city data
export async function renderSearchResult(e,element) {
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

          if (searchResult.length > 0) {
            const ul = document.createElement("ul");

            ul.className = `py-4`;
            ul.innerHTML = searchResult
              .map(
                (city, index) =>
                  `<li 
                data-city='${JSON.stringify(city)}'
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
              if (cityItem) {
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

export async function renderSearchHistory(e,element) {
  if (searchHistory.length === 0) return;
  console.log(searchHistory);
  const searchTerm = e.target.value.trim();
  if (searchTerm.length === 0) {
    clearElement(element);
    const ul = document.createElement("ul");

    ul.className = `py-4`;
    ul.innerHTML = searchHistory
      .map(
        (city, index) =>
          `<li 
                data-city='${JSON.stringify(city)}'
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
      if (cityItem) {
        const cityData = JSON.parse(cityItem.dataset.city);
        handleClick(cityData, element);
      }
    });

    element.appendChild(ul);
  } else {
    clearElement(element);
  }
}

async function handleClick(city, element) {
  const weatherData = await fetchWeather(city.lat, city.lon, "metric");
  console.log(weatherData);
  const existingCity = searchHistory.find(
    (item) => item.lat === city.lat && item.lon === city.lon
  );
  if (!existingCity) {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }

  // const weatherData = await fetchWeather();
  searchResult = [];
  clearElement(element);
  console.log(searchHistory);
}
