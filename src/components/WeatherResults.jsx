import { useEffect, useState } from "preact/hooks"
import wiMap from "../json/wi-map.json"
import DailyWeatherCarousel from "./DailyWeatherCarousel";


const iconMap = new Map(Object.entries(wiMap));


async function fetchWeather(Latitude,Longitude) {
  let response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${Latitude}&longitude=${Longitude}&hourly=temperature_2m%2Cprecipitation_probability%2Crain%2Cwindspeed_10m&daily=weathercode%2Ctemperature_2m_max%2Ctemperature_2m_min%2Cprecipitation_sum&current_weather=true&windspeed_unit=mph&timezone=auto`,
    {
      method: "GET",
    }
  ).then((res) => res.json());
  return response;
}


export default function(props) {

  const [ Latitude, Longitude ] = props.geocode;


  const [ weatherData, setWeatherData ] = useState(null);

  useEffect(() => {
    if(Latitude !== undefined){
      fetchWeather(Latitude, Longitude).then((data) => setWeatherData(data));
    }
  }, [props.geocode])
    return <div className={'wr-container'}>
        {props.geocode.length === 0 
        ? <div>Search for a region above!</div> 
        : (
            <>
            {weatherData !== null && (
                <div className="cr-container">
                  <div className="cr">
                    <div className="cr-content">
                      <div>
                      <h2>Current</h2>
                      <img
                        className="weather-icon d-inline-block"
                        src={iconMap.get(
                          weatherData.current_weather.is_day === 0
                            ? weatherData.current_weather.weathercode.toString() + "n"
                            : weatherData.current_weather.weathercode.toString()
                        )}
                      />
                      </div>
                      <div>
                        <h3>
                          <img
                            className="icon"
                            src="/weatherIcons/misc/wi-thermometer.svg?url"
                            alt="Thermometer"
                          />
                          {`${weatherData.current_weather.temperature} ${weatherData.hourly_units.temperature_2m}`}
                        </h3>
                        <h3>
                          <img
                            className="icon"
                            src="/weatherIcons/misc/wi-strong-wind.svg?url"
                            alt="Thermometer"
                          />
                          {`${weatherData.current_weather.windspeed} ${weatherData.hourly_units.windspeed_10m}`}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
            )}
            {weatherData !== null ? <DailyWeatherCarousel data={weatherData} /> : null}
          </>
        )}
    </div>
}