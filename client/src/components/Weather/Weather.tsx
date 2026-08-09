import { useEffect, useState } from "react";
import {
  FaCloudSun,
  FaTint,
  FaWind,
  FaEye,
  FaCloud,
  FaTemperatureHigh,
  FaRedo,
} from "react-icons/fa";
import "./Weather.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  visibility: number;
  clouds: {
    all: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}

function Weather() {
  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchWeather = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=${API_KEY}`
      );

      if (!res.ok) {
        throw new Error("Unable to fetch weather");
      }

      const data: WeatherData =
        await res.json();

      setWeather(data);
      setError("");
    } catch (err) {
      console.error(
        "Weather Error:",
        err
      );

      setError(
        "Weather service unavailable"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();

    const interval = setInterval(
      fetchWeather,
      600000
    );

    return () =>
      clearInterval(interval);
  }, []);

  /* =========================
     Loading
  ========================= */

  if (loading) {
    return (
      <div className="weather-skeleton">

        <div className="skeleton title" />

        <div className="skeleton location" />

        <div className="skeleton temp" />

        <div className="skeleton line" />

        <div className="skeleton-grid">
          <div className="skeleton box" />
          <div className="skeleton box" />
          <div className="skeleton box" />
          <div className="skeleton box" />
        </div>

      </div>
    );
  }

  /* =========================
     Error
  ========================= */

  if (error || !weather) {
    return (
      <div className="weather-card">

        <div className="weather-header">
          <div className="weather-title">
            <div className="weather-icon">
              <FaCloudSun />
            </div>

            <div>
              <h2>Weather</h2>
              <p>Fleet location conditions</p>
            </div>
          </div>
        </div>

        <div className="weather-error">

          <div className="error-icon">
            ⚠
          </div>

          <h3>
            Weather Unavailable
          </h3>

          <p>{error}</p>

          <button
            className="retry-btn"
            onClick={fetchWeather}
          >
            <FaRedo />
            Retry
          </button>

        </div>

      </div>
    );
  }

  const currentWeather =
    weather.weather[0];

  return (
    <section className="weather-card">

      {/* =========================
          Header
      ========================= */}

      <div className="weather-header">

        <div className="weather-title">

          <div className="weather-icon">
            <FaCloudSun />
          </div>

          <div>
            <h2>Weather</h2>

            <p>
              Current fleet location
            </p>
          </div>

        </div>

        <img
          className="weather-image"
          src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
          alt={currentWeather.description}
        />

      </div>

      {/* =========================
          Location
      ========================= */}

      <div className="weather-location">
        📍 {weather.name}
      </div>

      {/* =========================
          Main Temperature
      ========================= */}

      <div className="main-weather">

        <div className="temperature">
          {Math.round(
            weather.main.temp
          )}
          <span>°C</span>
        </div>

        <div className="weather-description">
          {currentWeather.description}
        </div>

      </div>

      {/* =========================
          Weather Stats
      ========================= */}

      <div className="weather-grid">

        <div className="weather-stat">

          <div className="stat-icon feels">
            <FaTemperatureHigh />
          </div>

          <div>
            <span>Feels Like</span>

            <strong>
              {Math.round(
                weather.main.feels_like
              )}
              °C
            </strong>
          </div>

        </div>

        <div className="weather-stat">

          <div className="stat-icon humidity">
            <FaTint />
          </div>

          <div>
            <span>Humidity</span>

            <strong>
              {weather.main.humidity}%
            </strong>
          </div>

        </div>

        <div className="weather-stat">

          <div className="stat-icon wind">
            <FaWind />
          </div>

          <div>
            <span>Wind</span>

            <strong>
              {weather.wind.speed} m/s
            </strong>
          </div>

        </div>

        <div className="weather-stat">

          <div className="stat-icon visibility">
            <FaEye />
          </div>

          <div>
            <span>Visibility</span>

            <strong>
              {(
                weather.visibility / 1000
              ).toFixed(1)}{" "}
              km
            </strong>
          </div>

        </div>

        <div className="weather-stat">

          <div className="stat-icon clouds">
            <FaCloud />
          </div>

          <div>
            <span>Clouds</span>

            <strong>
              {weather.clouds.all}%
            </strong>
          </div>

        </div>

        <div className="weather-stat">

          <div className="stat-icon range">
            <FaTemperatureHigh />
          </div>

          <div>
            <span>Min / Max</span>

            <strong>
              {Math.round(
                weather.main.temp_min
              )}
              ° /{" "}
              {Math.round(
                weather.main.temp_max
              )}
              °
            </strong>
          </div>

        </div>

      </div>

      {/* =========================
          Footer
      ========================= */}

      <div className="weather-footer">

        <span>
          Updated{" "}
          {new Date().toLocaleTimeString()}
        </span>

        <span className="weather-source">
          OpenWeather
        </span>

      </div>

    </section>
  );
}

export default Weather;