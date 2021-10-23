let cityList = [];
let cityname;

// local storage
spawnCityList();
spawnWeather();

// show search inputs as clickable list items in sidebar
function searchHistory() {
    $("#cityHistory").empty();
    $("#cityInput").val("");
    for (i = 0; i < cityList.length; i++) {
        let savedCityEl = $("<a>");
        savedCityEl.addClass("list-group-item list-group-item-action list-group-item-dark text-primary city");
        savedCityEl.attr("data-name", cityList[i]);
        savedCityEl.text(cityList[i]);
        $("#cityHistory").prepend(savedCityEl);
    }
}

// pull city list from local storage
function spawnCityList() {
    let cityLocalStorage = JSON.parse(localStorage.getItem("cities"));
    if (cityLocalStorage !== null) {
        cityList = cityLocalStorage;
    }
    searchHistory();
}

// on load, display current city(last searched) from local storage
function spawnWeather() {
    let storedWeather = JSON.parse(localStorage.getItem("currentCity"));
    if (storedWeather !== null) {
        cityInput = storedWeather;
        displayWeather();
        SpawnFiveDayForecast();
    }
}

// save array of cities to local storage & save active city to local storage
function storeToArray() {
    localStorage.setItem("cities", JSON.stringify(cityList));
}
function storeActiveCity() {
    localStorage.setItem("currentCity", JSON.stringify(cityInput));
}

// on click load that cities weather
$("#searchButton").on("click", function (event) {
    event.preventDefault();
    cityInput = $("#cityInput").val().trim();
    cityList.push(cityInput);
    storeActiveCity();
    storeToArray();
    searchHistory();
    displayWeather();
    SpawnFiveDayForecast();
});

async function displayWeather() {
    let APIkey = "9821b0d23b1f66242e790f48ced2591f";
    let apiLink = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=" + APIkey;

    let response = await $.ajax({
        url: apiLink,
        method: "GET"
    })
    let currentForecastBox = $("<div class='card-body' id='currentWeather'>");

    let getCurrentCity = response.name;
    let date = new Date();
    let val = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    let getCurrentIcon = response.weather[0].icon;

    let currentForecastIconEl = $("<img src = http://openweathermap.org/img/wn/" + getCurrentIcon + "@2x.png />");
    let currentCityEl = $("<h3 class = 'card-body'>").text(getCurrentCity + " (" + val + ")");
    currentCityEl.append(currentForecastIconEl);
    currentForecastBox.append(currentCityEl);

    let getLongitude = response.coord.lon;
    let getLatitude = response.coord.lat;
    let getTemp = response.main.temp.toFixed(1);
    let getHumidity = response.main.humidity;
    let getWindSpeed = response.wind.speed.toFixed(1);

    let tempEl = $("<p class='card-text'>").text("Temperature: " + getTemp + "°F");
    let humidityEl = $("<p class='card-text'>").text("Humidity: " + getHumidity + "%");
    let windSpeedEl = $("<p class='card-text'>").text("Wind Speed: " + getWindSpeed + " MPH");

    currentForecastBox.append(tempEl);
    currentForecastBox.append(humidityEl);
    currentForecastBox.append(windSpeedEl);

    let uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIkey + "&lat=" + getLatitude + "&lon=" + getLongitude;

    let uvResponse = await $.ajax({
        url: uvURL,
        method: "GET"
    })

    // colored UV Value
    let getUVIndex = uvResponse.value;
    let UvIndexValue = $("<div>");

    if (getUVIndex > 0 && getUVIndex <= 3.99) {
        UvIndexValue.addClass("favorable");
    } else if (getUVIndex >= 4 && getUVIndex <= 5.99) {
        UvIndexValue.addClass("moderate");
    } else {
        UvIndexValue.addClass("severe");
    }

    UvIndexValue.text(getUVIndex);
    let UvIndexEl = $("<p class='card-text'>");
    UvIndexValue.appendTo(UvIndexEl);
    currentForecastBox.append(UvIndexEl);

    $("#weatherBox").html(currentForecastBox);
    $("#forecastBox").html(forecastDiv);
}

async function SpawnFiveDayForecast() {
    let APIkey = "9821b0d23b1f66242e790f48ced2591f";
    let apiLink = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&units=imperial&appid=" + APIkey;

    let response = await $.ajax({
        url: apiLink,
        method: "GET"
    })

    let forecastDiv = $("<div id='fiveDayForecast'>");
    let forecastHeader = $("<h5 class='card-header'>").text("Five Day Forecast");

    forecastDiv.append(forecastHeader);

    let cardDeck = $("<div  class='card-deck'>");
    forecastDiv.append(cardDeck);

    for (i = 0; i < 5; i++) {
        let forecastCard = $("<div class='card mb-3 mt-3'>");
        let cardBody = $("<div class='card-body'>");

        let date = new Date();
        let val = (date.getMonth() + 1) + "/" + (date.getDate() + i + 1) + "/" + date.getFullYear();
        let forecastDate = $("<h5 class='card-title'>").text(val);

        let getCurrentIcon = response.list[i].weather[0].icon;
        let getTemp = response.list[i].main.temp;
        let getHumidity = response.list[i].main.humidity;

        let displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentIcon + ".png />");
        let tempEl = $("<p class='card-text'>").text(getTemp + "°F");
        let humidityEl = $("<p class='card-text'>").text("Humidity: " + getHumidity + "%");

        cardBody.append(forecastDate);
        cardBody.append(displayWeatherIcon);
        cardBody.append(tempEl);
        cardBody.append(humidityEl);
        forecastCard.append(cardBody);
        cardDeck.append(forecastCard);
    }
    $("#forecastBox").html(forecastDiv);
}

function savedCityDisplay() {
    cityInput = $(this).attr("data-name");
    displayWeather();
    SpawnFiveDayForecast();
}
$(document).on("click", ".city", savedCityDisplay);
