export default function (data){

    let out = {
        "days": [{
            "time": [""],
            "temperature_2m": [0],
            "precipitation_probability": [0],
            "rain": [0],
            "windspeed_10m": [0]
        }],
        "hourly_units": {
            "time": data.hourly_units.time,
            "temperature_2m": data.hourly_units.temperature_2m,
            "precipitation_probability": data.hourly_units.precipitation_probability,
            "rain": data.hourly_units.rain,
            "windspeed_10m": data.hourly_units.windspeed_10m}
    }

    let j = 0;
    for (let i = 0; i < 7; i++){

        

        let day = {
            "time": [""],
            "temperature_2m": [0],
            "precipitation_probability": [0],
            "rain": [0],
            "windspeed_10m": [0]
        }
        for (let k = 0; k < 24; k++, j++){
            day.time[k] = data.hourly.time[j];
            day.temperature_2m[k] = data.hourly.temperature_2m[j];
            day.precipitation_probability[k] = data.hourly.precipitation_probability[j];
            day.rain[k] = data.hourly.rain[j];
            day.windspeed_10m[k] = data.hourly.windspeed_10m[j];

        }
        out.days[i] = day;
    }
    return out;
}