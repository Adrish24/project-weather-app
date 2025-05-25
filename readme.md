# Weather Forecast App

A responsive, intuitive weather application that provides current weather conditions and 5-day forecasts for locations worldwide.

## Repository
[Github Repository](https://github.com/Adrish24/project-weather-app)

## Features

- **Location Search**: Search for weather by city name 
- **Current Location**: Get weather data based on your current location
- **Current Weather**: current weather conditions:
  - Temperature
  - Feels like temperature
  - Wind speed
  - Humidity
  - Pressure
  - Visibility
  - Dew point

- **5-Day Forcase**: See upcoming weather conditions for the next five days
- **Search History**: Access previously search locations 
- **Home City**: Set and save default home city for immediate access of app load
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktio devices


## Technologies Used
- **HTML5**
- **CSS3** with TailwindCSS
- **Javascript**
- **API**:
  - OpenWeatherMap OneCall API (weather data)
  - OpenWeatherMap Geocoding API (location search)
  - OpenWeatherMap Reverse Geocoding API (coordinates to location name)
  - Browser Geolocation API


## Implementation Details

### Code Organization
Ther project gollows a modular structure:


- **script.js**: Main application entry point and event handlers
- **src/clearElement.js**: Utility for DOM element cleanup
- **src/fetcher.js**: APU interaction with OpenWeatherMap services
- **src/handleSearch.js**: Search fucntionality and history management
- **src/weatherData.js**: Weather data rendering and display logic
- **src/input.css**: TailwindCSS source styles
- **src/output.css**: Compiled TailwindCSS output


### Key Functionality

1. **Weather Data Retrival**
   - Fetches realtive weather data usng OpenWeatherMap's OneCall API

2. **Search System**
   - Implements debouce search for improved performance
   - Provides real-time search suggestions
   - Mantains search history for quick access to frequent locations

3. **Persistent Storage**
   - Uses localStorage to remember:
     - Search history
     - Home city preference
     - Last viewed locations

4. **User Interface**
   - Clean, intuitive interface with responsive design
   - Visual weather indicatiors with appropriate icons
   - East-to-read temperature and condition displays



