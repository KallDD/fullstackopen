import axios from "axios";
import { useState, useEffect } from "react";

const api_key = import.meta.env.WEATHER_API_KEY

const Countrydata = ({ country }) => {
  if (!country) return null;

  const [wind, setWind] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [weather, setWeather] = useState(null);
  const [icon, setIcon] = useState(null);

  const latitude = country.capitalInfo.latlng[0];
  const longitude = country.capitalInfo.latlng[1];

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`)
      .then(response => {
        setWind(response.data.wind.speed);
        setTemperature((response.data.main.temp - 273.15).toFixed(1));
        setWeather(response.data.weather[0].description);
        setIcon(response.data.weather[0].icon);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }, [latitude, longitude]);
  
  return (
      <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area} km²</p>
        <h3>Languages</h3>
        <ul>
          {Object.values(country.languages).map(language => 
            <li key={language}>{language}</li>
          )}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />

        <h3>Weather in {country.capital}</h3>
        <p>Temperature: {temperature}°C</p>
        <p>Weather: {weather}</p>
        {icon && (
          <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="Weather icon" />
        )}
        <p>Wind: {wind} m/s</p>
      </div>
    )
}
export default Countrydata;