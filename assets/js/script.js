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

var getUVIndex = function(lat,lon){
    var apiUrl = dailyUVIndexApiStarts + personalAPIKey + "&lat=" + lat + "&lon=" + lon + "&" + unit;

    fetch(apiUrl).then(function(response){
        return response.json();
    })
    .then(function(response){
        $("#UVIndexToday").removeClass();
        $("#UVIndexToday").html(response.value);
        if(response.value < 3){
            $("#UVIndexToday").addClass("p-1 rounded bg-success text-white");
        } else if (response.value < 8) {
            $("#UVIndexToday").addClass("p-1 rounded bg-warning text-white");
        } else {
            $("#UVIndexToday").addClass("p-1 rounded bg-warning text-white");
        }
    });
};

var getForecast = function(lat,lon){
    var apiUrl = forecastWeatherApiStarts + "&lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly" + "&" + personalAPIKey + "&" + unit;
    fetch(apiUrl).then(function(response){
        return response.json();
    })
    .then(function(response){
        for (var i = 1; i < 6; i++){
            var unixTime = response.daily[i].dt;
            var date = moment.unix(unixTime).format("MM/DD/YY");
            $("#Date" + i).html(date);

            var weatherIconUrl = "https://openweathermap.org/img/wn/" + response.daily[i].temp.day + " \u00B0F";
            $("#tempDay" + i).html(temp);

            var humidity = response.daily[i].humidity;
            $("#humidityDay" + i).html(humidity + " %");
        }
    });
};

// Buttons

var createBtn = function(btnText){
    var btn = $("<button>").text(btnText).addClass("list-group-item list-group-item-action").attr("type", "submit");
    return btn;
};

var loadSavedCity = function(){
    citiesListArr = JSON.parse(localStorage.getItem("weatherInfo"));
    if (citiesListArr == null){
        citiesListArr = [];
    }
    for (var i = 0; i < citiesListArr.length; i++){
        var cityNameBtn = createBtn(citiesListArr[i]);
        searchedCities.append(cityNameBtn);
    }
};

var saveCityName = function(searchCityName){
    var newCity = 0;
    citiesListArr = JSON.parse(localStorage.getItem("weatherInfo"));
    if(citiesListArr == null){
        citiesListArr = [];
        citiesListArr.unshift(searchCityName);
    } else {
        for (var i = 0; i < citiesListArr.length; i++){
            if (searchCityName.toLowerCase() == citiesListArr[i].toLowerCase()){
                return newCity;
            }
        }
        if (citiesListArr.length < numOfCities){
            citiesListArr.unshift(searchCityName);
        } else {
            citiesListArr.pop();
            citiesListArr.unshift(searchCityName);
        }
    }
    localStorage.setItem("weatherInfo", JSON.stringify(citiesListArr));
    newCity = 1;
    return newCity;
};