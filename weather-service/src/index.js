const axios = require("axios")

const _getWeather = async function (weatherStation) {
    weatherStation = weatherStation ? weatherStation : "KOSU"
    let result = ""
    const weatherResponse = await axios.get(`https://w1.weather.gov/xml/current_obs/${weatherStation}.xml`)
    try {
        let location = (weatherResponse.data.match(/\<location\>(.*)\<\/location\>/))[1]
        let temperature = (weatherResponse.data.match(/\<temperature_string\>(.*)\<\/temperature_string\>/))[1]
        result += weatherStation + " - " + location + " - " + temperature
    } catch (e) {
        result += e
    }
    return result
}

exports.getWeather = _getWeather