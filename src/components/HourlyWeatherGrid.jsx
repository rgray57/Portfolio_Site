export default function (props) {
  let indx = parseInt(props.indx);

  return (
    <div className={"hr-container"}>
        <h3>Hourly Weather</h3>
    <div className="hr-grid-container">
      {props.data.days[indx].time.map((e, i) => {
        return (
          <div
            className="hr-col"
            key={i}
          >
            <h6>{props.data.days[indx].time[i].substring(11)}</h6>
            <div>
              <div className="d-flex">
                <img
                  src="/weatherIcons/misc/wi-thermometer.svg?url"
                  width={30}
                  height={30}
                  alt="thermometer"
                />
                <p className="m-0">
                  {props.data.days[indx].temperature_2m[i]}
                  {props.data.hourly_units.temperature_2m}
                </p>
              </div>
              <div className="d-flex">
                <img
                  src="/weatherIcons/misc/wi-strong-wind.svg?url"
                  width={30}
                  height={30}
                  alt="wind"
                />
                <p className="m-0">
                  {props.data.days[indx].windspeed_10m[i]}
                  {props.data.hourly_units.windspeed_10m}
                </p>
              </div>
            </div>
            <div>
              <div className="d-flex">
                <img
                  src="/weatherIcons/misc/wi-flood.svg?url"
                  width={30}
                  height={30}
                  alt="rain level"
                />
                <p className="m-0">
                  {props.data.days[indx].rain[i]}
                  {props.data.hourly_units.rain}
                </p>
              </div>
              <div className="d-flex justify-content-center">
                <p className="m-0">
                  {props.data.days[indx].precipitation_probability[i]}
                  {props.data.hourly_units.precipitation_probability}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
}
