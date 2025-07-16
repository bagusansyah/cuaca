import React, { useEffect, useState, useRef } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";

const Weather = () => {
  const [darkMode, setDarkMode] = useState(true);
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [loading, setLoading] = useState(false);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": cloud_icon,
    "04n": drizzle_icon,
    "09d": drizzle_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "11d": rain_icon,
    "11n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    if (!city.trim()) {
      alert("Please enter a valid city name.");
      return;
    }
    setLoading(true);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_API_ID
      }`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        setWeatherData(false);
        setLoading(false);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      setWeatherData(false);
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search("Jakarta");
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search(inputRef.current.value);
    }
  };

  return (
    <>
      <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle">
        {darkMode ? "🌞" : "🌙"}
      </button>

      <div className={`weather ${darkMode ? "dark" : "light"}`}>
        <div className="search-bar">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter city..."
            onKeyDown={handleKeyDown}
          />
          <img
            src={search_icon}
            alt="Search"
            onClick={() => search(inputRef.current.value)}
          />
        </div>

        {loading ? (
          <p style={{ color: "#fff", marginTop: "30px" }}>Memuat...</p>
        ) : weatherData ? (
          <>
            <img
              src={weatherData.icon}
              alt="Weather icon"
              className="weather-icon"
            />
            <div className="temperature">{weatherData.temperature}°C</div>
            <div className="location">{weatherData.location}</div>

            <div className="weather-data">
              <div className="col">
                <img src={humidity_icon} alt="Humidity" />
                <div>
                  <p>{weatherData.humidity}%</p>
                  <span>Kelembapan</span>
                </div>
              </div>
              <div className="col">
                <img src={wind_icon} alt="Wind" />
                <div>
                  <p>{weatherData.windSpeed} Km/h</p>
                  <span>Kecepatan Angin</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p style={{ color: "#fff", marginTop: "30px" }}>
            Tidak ada data cuaca tersedia.
          </p>
        )}
      </div>
    </>
  );
};

export default Weather;
