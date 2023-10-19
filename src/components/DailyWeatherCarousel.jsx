import { useState } from "preact/hooks";
import daysMap from "../json/days-map.json"
import wiMap from "../json/wi-map.json"
import sortHourlyWeather from "../scripts/sortHourlyWeather";
import HourlyWeatherGrid from "./HourlyWeatherGrid";



const dayMap = new Map(Object.entries(daysMap));
const iconMap = new Map(Object.entries(wiMap));



function DailyWeatherCarousel(props) {
  const WeatherData = props.data;

  let [activeCard, setActiveCard] = useState("0");

  let hourlyWeather = sortHourlyWeather(WeatherData);

  function handleDrButtonClick(e){
    let inc = parseInt(e.target.getAttribute("direction"));
    let tmp = parseInt(activeCard) + inc;
    let res = Math.max(0,Math.min(tmp, 6)).toString();
  
    setActiveCard(res);
  }

  return (
    <>
      <div className="dr-container">
        <div className="dr-mobile">
            <button className="dr-button" direction="-1" onClick={handleDrButtonClick}>&larr;</button>
            <h4>
                {dayMap.get( new Date(WeatherData.daily.time[parseInt(activeCard)]).getDay().toString()
                    ) + ` ${WeatherData.daily.time[parseInt(activeCard)].substring(8, 10)}`}
              </h4>
              <div className="carousel-card-content">
                <img
                  className="weather-icon"
                  src={iconMap.get(
                    WeatherData.daily.weathercode[parseInt(activeCard)].toString()
                  )}
                />
                <div className="extra-daily-data d-flex">
                  <h5>{`TEMP: ${WeatherData.daily.temperature_2m_min[parseInt(activeCard)]}${WeatherData.daily_units.temperature_2m_min} | ${WeatherData.daily.temperature_2m_max[parseInt(activeCard)]}${WeatherData.daily_units.temperature_2m_max}`}</h5>
                  <h5>{`RAIN: ${WeatherData.daily.precipitation_sum[parseInt(activeCard)]}${WeatherData.daily_units.precipitation_sum}`}</h5>
                </div>
              </div>
            <button className="dr-button" direction="1" onClick={handleDrButtonClick}>&rarr;</button>
        </div>
        <div className="dr-desktop d-none">
            {WeatherData.daily.time.map((t, indx) => {
          return (
            <button
              id={indx.toString()}
              key={indx.toString()}
              className={`carousel-card ${
                activeCard === indx.toString() ? "active-card" : ""
              }`}
              onClick={(e) => {
                setActiveCard(e.currentTarget.id);
              }}
            >
              <h4>
                {indx === 0
                  ? "Today"
                  : dayMap.get(
                      new Date(WeatherData.daily.time[indx]).getDay().toString()
                    ) + ` ${WeatherData.daily.time[indx].substring(8, 10)}`}
              </h4>
              <div className="carousel-card-content">
                <img
                  className="weather-icon"
                  src={iconMap.get(
                    WeatherData.daily.weathercode[indx].toString()
                  )}
                />
                <div className="extra-daily-data d-none">
                  <h5>{`TEMP: ${WeatherData.daily.temperature_2m_min[indx]}${WeatherData.daily_units.temperature_2m_min} | ${WeatherData.daily.temperature_2m_max[indx]}${WeatherData.daily_units.temperature_2m_max}`}</h5>
                  <h5>{`RAIN: ${WeatherData.daily.precipitation_sum[indx]}${WeatherData.daily_units.precipitation_sum}`}</h5>
                </div>
              </div>
            </button>
          );
        })}
        </div>
        
      </div>
      <HourlyWeatherGrid data={hourlyWeather} indx={activeCard} />
    </>
  );
}

export default DailyWeatherCarousel;
