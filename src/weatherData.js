import clearElement from "./clearElement.js";
import { renderSearchHistoryList } from "./handleSearch.js";

let isEventListenrAttached = false; // to check if the event listener is attached to the search history list
export function renderWeatherData(weather, city) {
  let homeCity = JSON.parse(localStorage.getItem("homeCity")) || null;
  if (!weather || !city) return;
  console.log(weather, city);
  const weatherContainer = document.querySelector("[data-weather-container]");

  clearElement(weatherContainer);

  //   Convert UTC timestamp to local time for the location
  const currentTime = new Date();

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  // Format the local time to readable string
  const formatedTime = new Intl.DateTimeFormat("en-US", options).format(
    currentTime
  );

  weatherContainer.innerHTML = `
        <div class="flex gap-2 mb-4">
          <h2 class="font-semibold text-white">${city?.name}, ${city?.state}, ${
    city?.country
  }</h2>
          ${
            homeCity?.lat === city?.lat
              ? `
            <div class="text-white">
              <svg
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
              >
              <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/>
              </svg> 
            </div>`
              : `<button title="Set as home city"
            data-home
            class="border-1 border-white rounded-full p-1 text-white cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"
              />
            </svg>
          </button>`
          }
        </div>
        <div class="grid grid-cols-1 grid-rows-6 lg:grid-cols-5 lg:grid-rows-3 gap-4">
          <div 
          class="
          bg-cyan-500/10 
          py-4 w-full 
          rounded-4xl 
          lg:col-span-5 lg:row-span-2 row-span-2
          ">
            <div class="px-6 mb-2 w-full">
              <h3 class="text-sm font-semibold text-white">Current weather</h3>
              <span class="text-xs font-semibold text-white/90">${formatedTime}</span>
            </div>
           <div class="flex flex-col lg:flex-row lg:items-center">
            <div class="flex flex-wrap md:flex-nowrap items-center-safe px-6 mb-2">
               <img class="lg:w-40 lg:h-40" src="https://openweathermap.org/img/wn/${
                 weather.current.weather[0].icon
               }@2x.png" alt="${weather.current.weather[0].main}" />
               <h2 class="text-white text-4xl lg:text-6xl font-thin">
                  ${parseInt(weather.current.temp)}°C 
               </h2>
               <div class="w-full ml-4">
               <p class="font-semibold text-white text-lg truncate w-full">${
                 weather.current.weather[0].description
               }</p>
               <p class="text-white/80">Feels like ${parseInt(
                 weather.current.feels_like
               )}°C</p>
               </div>
            </div>
            <div class="px-6">
                 <p class="text-white">Wind: ${parseInt(
                   weather.current.wind_speed
                 )} Km/h</p>
                 <p class="text-white">Humidity: ${parseFloat(
                   weather.current.humidity
                 )} %</p>
                 <p class="text-white">Pressure: ${parseInt(
                   weather.current.pressure
                 )} mb</p>
                 <p class="text-white">Visibility: ${parseInt(
                   weather.current.visibility
                 )} Km</p>
                 <p class="text-white">Dew point: ${parseInt(
                   weather.current.dew_point
                 )}°</p>
            </div>
           </div>
          </div>
          <div class="bg-cyan-500 opacity-10  w-full rounded-4xl h-40">2</div>
          <div class="bg-cyan-500 opacity-10  w-full rounded-4xl h-40">3</div>
          <div class="bg-cyan-500 opacity-10  w-full rounded-4xl h-40">4</div>
          <div class="bg-cyan-500 opacity-10  w-full rounded-4xl h-40">5</div>
          <div class="bg-cyan-500 opacity-10  w-full rounded-4xl h-40">6</div>
        </div>`;

  // Attach event listener to the home button
  const homeBtn = weatherContainer.querySelector("[data-home]");
  if (!homeBtn) return;
  if (isEventListenrAttached) {
    homeBtn.removeEventListener("click", handleSave);
  }

  //   Function to handleSaving the current city as home city
  function handleSave() {
    save(city);
    renderSearchHistoryList();
    renderWeatherData(weather, city);
    console.log("saved");
  }

  homeBtn.addEventListener("click", handleSave);

  isEventListenrAttached = true;
}

// Function to save the city data to localStorage
function save(city) {
  localStorage.setItem("homeCity", JSON.stringify(city));
}
