# SkyCast Weather App

A responsive weather application built with **HTML5, CSS3, JavaScript and DOM manipulation**.

## Features

- Search weather by city
- Current temperature and weather condition
- Humidity, wind speed, visibility and pressure
- 5-day forecast
- Celsius/Fahrenheit switch
- Current-location weather using browser Geolocation
- Light/Dark theme with localStorage
- Loading and error states
- Responsive UI for desktop and mobile
- No API key required

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- DOM API
- Fetch API
- Open-Meteo Geocoding API
- Open-Meteo Weather API

## Project Structure

```text
weather-app/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
└── README.md
```

## How the App Works

1. User enters a city.
2. JavaScript sends the city name to the geocoding API.
3. Latitude and longitude are returned.
4. JavaScript sends those coordinates to the weather API.
5. The JSON response is received.
6. DOM elements are updated dynamically.
7. The current weather and forecast appear on the screen.

## Important JavaScript Concepts

### DOM

`document.querySelector()` selects HTML elements so JavaScript can update them.

### Events

The app listens for form submission and button clicks using `addEventListener()`.

### Fetch API

`fetch()` requests data from the weather service.

### Async/Await

`async/await` makes asynchronous API code easier to read.

### Error Handling

`try/catch` displays useful messages when the city is invalid or the API request fails.

## UI/UX Decisions

- Clear visual hierarchy
- Large temperature display
- Card-based weather details
- Responsive grid
- Search field is always easy to find
- Loading and error feedback
- Dark mode for comfortable viewing
- Mobile-friendly controls
- Consistent spacing, rounded corners and typography

## Run the Project

You can open `index.html` in a modern browser. For the best development experience, use VS Code with a local server such as Live Server.

Because the app uses browser APIs, a local server is recommended for testing the location feature.

## Future Improvements

- Hourly forecast
- Weather charts
- Saved favourite cities
- Sunrise/sunset information
- Weather alerts
- Animated weather backgrounds
- Progressive Web App (PWA) support
- More accessibility improvements

## Data Source

Weather information is provided by Open-Meteo. The application is designed as a frontend learning project.
