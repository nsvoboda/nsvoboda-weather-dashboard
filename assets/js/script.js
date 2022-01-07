var citiesListArr = [];
var numOfCities = 9;
var personalAPIKey = "appid=350d6a65f722e2f68993f8e83b2513f1";
var unit = "units=imperial";
var dailyWeatherApiStarts = "https://api.openweathermap.org/data/2.5/weather?q=";
var dailyUVIndexApiStarts = "https://api.openweathermap.org/data/2.5/uvi?";
var forecastWeatherApiStarts = "https://api.openweathermap.org/data/2.5/onecall?";

var searchCityForm = $("#searchCityForm");
var searchedCities = $("#searchedCityLi");

var getCityWeather = function(searchCityName){

    var apiUrl = dailyWeatherApiStarts + searchCityName + "&" + personalAPIKey + "&" + unit;

    fetch(apiUrl).then(function(response){
        if(response.ok){
            return response.json().then(function(response){
                $("#cityName").html(response.name);

                var unixTime = response.dt;
                var date = moment.unix(unixTime).format("MM/DD/YY");
                $("#currentdate").html(date);

                var weatherIconUrl = "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png";
                $("#weatherIconToday").attr("src", weatherIconUrl);
                $("#tempToday").html(response.main.temp + " \u00B0F");
                $("#humidityToday").html(response.main.humidity + " %");
                $("#windSpeedToday").html(response.wind.speed + " MPH");

                var lat = response.coord.lat;
                var lon = response.coord.lon;

                getUVIndex(lat, lon);
                getForecast(lat, lon);
            });
        } else {
            alert("Please provide a valid city name.");
        }
    });
};