import { useEffect, useRef, useState } from "preact/hooks";

import WeatherResults from "./WeatherResults";
import "../styles/weather.css"

export default function () {

  async function fetchSuggestions(fieldVal){
    await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${fieldVal}&count=10&language=en&format=json`).then(res => res.json()).then(suggs => {
      setSuggestions(suggs.results);
    })
  }

  const [suggestions, setSuggestions] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [geocode, setGeocode] = useState([]);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  useEffect(() => {
    if(searchRef.current === document.activeElement){
      suggestionsRef.current.classList.remove("d-none")
    }
    else{
      suggestionsRef.current.classList.add("d-none")
    }
  })


  return (
    <div class="weather-container">
    <div id="search-container">
        <div class="input-container">
          <input
            type="search"
            id="weather-searchbar"
            value={inputVal}
            placeholder="Search by Capital Cities"
            aria-label="Search"
            onInput={(e) => {
              setInputVal(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            ref={searchRef}
          />
        </div>
        <div className="sugg-container" ref={suggestionsRef}>
          {suggestions !== undefined && searchRef.current === document.activeElement ? suggestions.map((sugg) => {
            return(
              <button id={sugg.id} onClick={() => setGeocode([sugg.latitude, sugg.longitude])}>
                <div>
                  <h4>{sugg.name}</h4>
                  <h5>{sugg.country}</h5>
                </div>
                <p>{sugg.latitude + " | " + sugg.longitude}</p>
              </button>
            );
          }) : null}
        </div>
    </div>
    <WeatherResults geocode={geocode}/>
</div>
  );
}
