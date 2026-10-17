const state = {
  city: "New Delhi",
  latitude: 28.6139,
  longitude: 77.2090,
  unit: "C",
  theme: localStorage.getItem("theme") || "light",
  weather: null
};

const $ = (selector) => document.querySelector(selector);

const elements = {
  searchForm: $("#searchForm"),
  cityInput: $("#cityInput"),
  locationBtn: $("#locationBtn"),
  unitToggle: $("#unitToggle"),
  themeToggle: $("#themeToggle"),
  status: $("#status"),
  cityName: $("#cityName"),
  dateText: $("#dateText"),
  weatherIcon: $("#weatherIcon"),
  temperature: $("#temperature"),
  condition: $("#condition"),
  feelsLike: $("#feelsLike"),
  humidity: $("#humidity"),
  wind: $("#wind"),
  visibility: $("#visibility"),
  pressure: $("#pressure"),
  forecast: $("#forecast")
};

document.documentElement.dataset.theme = state.theme;
updateThemeButton();
updateUnitButton();

elements.searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = elements.cityInput.value.trim();
  if (!city) return;
  await searchCity(city);
});

elements.locationBtn.addEventListener("click", getCurrentLocation);

elements.unitToggle.addEventListener("click", () => {
  state.unit = state.unit === "C" ? "F" : "C";
  updateUnitButton();
  if (state.weather) renderWeather(state.weather);
});

elements.themeToggle.addEventListener("click", () => {
  state.theme = state.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = state.theme;
  localStorage.setItem("theme", state.theme);
  updateThemeButton();
});

function updateUnitButton() {
  elements.unitToggle.textContent = `°${state.unit}`;
}

function updateThemeButton() {
  elements.themeToggle.textContent = state.theme === "light" ? "☾" : "☀";
}

async function searchCity(city) {
  setStatus("Searching for city...");
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("City search failed.");
    const data = await response.json();

    if (!data.results?.length) {
      throw new Error("City not found. Try another city name.");
    }

    const place = data.results[0];
    state.city = [place.name, place.admin1, place.country].filter(Boolean).join(", ");
    state.latitude = place.latitude;
    state.longitude = place.longitude;

    await loadWeather();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function loadWeather() {
  setStatus("Loading weather...");
  try {
    const params = new URLSearchParams({
      latitude: state.latitude,
      longitude: state.longitude,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,surface_pressure,visibility",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      timezone: "auto",
      forecast_days: "6"
    });

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) throw new Error("Weather service is unavailable.");
    state.weather = await response.json();

    renderWeather(state.weather);
    setStatus("");
  } catch (error) {
    setStatus(error.message, true);
  }
}

function renderWeather(data) {
  const current = data.current;
  const daily = data.daily;

  elements.cityName.textContent = state.city;
  elements.dateText.textContent = formatDate(new Date());

  elements.weatherIcon.textContent = getWeatherInfo(current.weather_code, current.is_day).icon;
  elements.temperature.textContent = round(convertTemp(current.temperature_2m));
  elements.condition.textContent = getWeatherInfo(current.weather_code, current.is_day).label;
  elements.feelsLike.textContent = `Feels like ${round(convertTemp(current.apparent_temperature))}°`;

  elements.humidity.textContent = `${current.relative_humidity_2m}%`;
  elements.wind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  elements.visibility.textContent = `${(current.visibility / 1000).toFixed(1)} km`;
  elements.pressure.textContent = `${Math.round(current.surface_pressure)} hPa`;

  elements.forecast.innerHTML = daily.time.slice(0, 5).map((date, index) => {
    const info = getWeatherInfo(daily.weather_code[index], 1);
    return `
      <article class="forecast-card card">
        <p class="day">${formatDay(date, index)}</p>
        <div class="forecast-icon">${info.icon}</div>
        <span class="max">${round(convertTemp(daily.temperature_2m_max[index]))}°</span>
        <span class="min">${round(convertTemp(daily.temperature_2m_min[index]))}°</span>
        <p class="rain">💧 ${daily.precipitation_probability_max[index] ?? 0}%</p>
      </article>
    `;
  }).join("");
}

function convertTemp(celsius) {
  return state.unit === "C" ? celsius : (celsius * 9 / 5) + 32;
}

function round(value) {
  return Math.round(value);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(date);
}

function formatDay(dateString, index) {
  if (index === 0) return "Today";
  return new Intl.DateTimeFormat("en-IN", { weekday: "short" })
    .format(new Date(`${dateString}T12:00:00`));
}

function getWeatherInfo(code, isDay = 1) {
  const map = {
    0: { label: isDay ? "Clear sky" : "Clear night", icon: isDay ? "☀️" : "🌙" },
    1: { label: "Mainly clear", icon: "🌤️" },
    2: { label: "Partly cloudy", icon: "⛅" },
    3: { label: "Overcast", icon: "☁️" },
    45: { label: "Foggy", icon: "🌫️" },
    48: { label: "Rime fog", icon: "🌫️" },
    51: { label: "Light drizzle", icon: "🌦️" },
    53: { label: "Drizzle", icon: "🌦️" },
    55: { label: "Heavy drizzle", icon: "🌧️" },
    61: { label: "Light rain", icon: "🌦️" },
    63: { label: "Rain", icon: "🌧️" },
    65: { label: "Heavy rain", icon: "🌧️" },
    71: { label: "Light snow", icon: "🌨️" },
    73: { label: "Snow", icon: "❄️" },
    75: { label: "Heavy snow", icon: "❄️" },
    80: { label: "Rain showers", icon: "🌦️" },
    81: { label: "Rain showers", icon: "🌧️" },
    82: { label: "Heavy showers", icon: "⛈️" },
    95: { label: "Thunderstorm", icon: "⛈️" },
    96: { label: "Thunderstorm + hail", icon: "⛈️" },
    99: { label: "Heavy thunderstorm", icon: "⛈️" }
  };
  return map[code] || { label: "Unknown weather", icon: "🌡️" };
}

function getCurrentLocation() {
  if (!navigator.geolocation) {
    setStatus("Geolocation is not supported by your browser.", true);
    return;
  }

  setStatus("Getting your location...");
  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      state.latitude = coords.latitude;
      state.longitude = coords.longitude;
      state.city = "Your Location";
      await loadWeather();
    },
    () => setStatus("Location permission was not granted.", true),
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function setStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.className = `status${isError ? " error" : ""}`;
}

loadWeather();
