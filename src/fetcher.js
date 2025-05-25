const API_KEY = "b54f2fba3adfaa96d58cbc20b6d91961";
const ONECALL_URL = "https://api.openweathermap.org/data/3.0/onecall";
const GEOCODING_URL = "http://api.openweathermap.org/geo/1.0/direct";
const REVERSE_GEOCODING_URL = "http://api.openweathermap.org/geo/1.0/reverse";

export async function fetchWeather(lat, lon, units) {
  console.log("Fetching weather data...");
  try {
    const res = await fetch(
      `${ONECALL_URL}?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${API_KEY}&units=${units}`
    );
    if (!res.ok) {
      alert("Error fetching weather data, try again later");
    }
    const weatherData = await res.json();
    return weatherData;
  } catch (error) {
    alert("Something went wrong while fetching data, try again later");
    console.error("Error fetching data", error);
  }
}

export async function fetchCity(city, limit = 1) {
  console.log("Fetching city data...");
  try {
    const res = await fetch(
      `${GEOCODING_URL}?q=${city}&limit=${limit}&appid=${API_KEY}`
    );
    if (!res.ok) {
      alert("Error fetching City data, try again later");
    }
    const cityData = await res.json();
    return cityData;
  } catch (error) {
    alert("Something went wrong while fetching data, try again later");
    console.error("Error fetching data", error);
  }
}

export async function fetchCityByLatAndLon(lat, lon, limit = 1) {
  console.log("Fetching city data...");
  try {
    const res = await fetch(
      `${REVERSE_GEOCODING_URL}?lat=${lat}&lon=${lon}&limit=${limit}&appid=${API_KEY}`
    );
    if (!res.ok) {
      alert("Error fetching City data, try again later");
    }
    const cityData = await res.json();
    return cityData;
  } catch (error) {
    alert("Something went wrong while fetching data, try again later");
    console.error("Error fetching data", error);
  }
}
