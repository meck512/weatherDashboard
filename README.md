
Third-party APIs allow developers to access their data and functionality by making requests with specific parameters to a URL. Developers are often tasked with retrieving data from another application's API and using it in the context of their own. Your challenge is to build a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS.

Use the OpenWeather One Call API (Links to an external site.) to retrieve weather data for cities. Read through the documentation for setup and usage instructions. You will use localStorage to store any persistent data.
https://openweathermap.org/api/one-call-api


User Story
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly

Acceptance Criteria
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city


Grading Requirements
This challenge is graded based on the following criteria:

Technical Acceptance Criteria: 40%
Satisfies all of the above acceptance criteria plus the following:

Uses the OpenWeather API to retrieve weather data

Uses localStorage to store persistent data



Deployment: 32%
Application deployed at live URL

Application loads with no errors

Application GitHub URL submitted

GitHub repository that contains application code



Application Quality: 15%
Application user experience is intuitive and easy to navigate

Application user interface style is clean and polished

Application resembles the mock-up functionality provided in the Challenge instructions



Repository Quality: 13%
Repository has a unique name

Repository follows best practices for file structure and naming conventions

Repository follows best practices for class/id naming conventions, indentation, quality comments, etc.

Repository contains multiple descriptive commit messages

Repository contains quality README file with description, screenshot, and link to deployed application



How to Submit the Challenge
You are required to submit BOTH of the following for review:

The URL of the functional, deployed application.

The URL of the GitHub repository. Give the repository a unique name and include a README describing the project.

https://courses.bootcampspot.com/courses/656/assignments/12688?module_item_id=200489


9821b0d23b1f66242e790f48ced2591f


var weatherApi = "http://api.openweathermap.org/data/2.5/forecast?q=Akron&units=imperial&appid=c81ae0be75f519c71d1f855b95d48ec3"
var apiKey = "9821b0d23b1f66242e790f48ced2591f";

var userInput = $("#userInput");
var searchButton = $("#searchButton");
var clearHistoryButton = $("#clearHistoryButton");
var historyList = $('#savedSearches');


var cityList = [];

// BUTTONS
searchButton.on("click", function(event){
    event.preventDefault();
    var inputValue = userInput.val().trim();
    weatherRequest(inputValue)
    searchHistory(inputValue);    
    userInput.val(""); 
});

clearHistoryButton.on("click", function(){
    cityList = [];
    listArray();
});

// Grab city list string from local storage
// and update the city list array
// for the search history sidebar
function spawnHistory() {
    if (localStorage.getItem("cities")) {
        cityList = JSON.parse(localStorage.getItem("cities"));
        var lastIndex = cityList.length - 1;
        // console.log(cityList);
        listArray();
        // Display the last city viewed
        // if page is refreshed
        if (cityList.length !== 0) {
            weatherRequest(cityList[lastIndex]);
        }
    }
};

// Display and save the search history of cities
function searchHistory(searchValue) {
    // Grab value entered into search bar 
    // var searchValue = searchCityInput.val().trim();
    
    // If there are characters entered into the search bar
    if (searchValue) {
        // Place value in the array of cities
        // if it is a new entry
        if (cityList.indexOf(searchValue) === -1) {
            cityList.push(searchValue);
            // List all of the cities in user history
            listArray();
        } else {
            // Remove the existing value from
            // the array
            var removeIndex = cityList.indexOf(searchValue);
            cityList.splice(removeIndex, 1);

            // Push the value again to the array
            cityList.push(searchValue);

            // list all of the cities in user history
            // so the old entry appears at the top
            // of the search history
            listArray();
            clearHistoryButton.removeClass("hide");
            weatherContent.removeClass("hide");
        }
    }
    console.log(cityList);
};
// history buttons that spawn from user input
function listArray() {
    historyList.empty();
    cityList.forEach(function(city){
        var historyLiEl = $('<li class="list-group-item city-btn">'); 
        historyLiEl.attr("data-value", city);
        historyLiEl.text(city);
        historyList.prepend(historyLiEl);
    });
    localStorage.setItem("cities", JSON.stringify(cityList));
};

historyList.on("click","li.cityButton", function(event) {
    var value = $(this).data("value");
    weatherRequest(value);
    searchHistory(value); 
});

// API code
function weatherRequest() {
    fetch(weatherApi).then(response => {
        return response.json()

    }).then(data => {
        var lat = data.city.coord.lat
        var lon = data.city.coord.lon
        console.log(lat)
        console.log(lon)
        var cityName = data.city.name

        var currentDateStr = (data.list[0].dt_txt);
        var currentDate = currentDateStr.split(" ");


        var uvApi = "https://api.openweathermap.org/data/2.5/onecall?&lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
        fetch(uvApi).then(response => {
            return response.json()

        }).then(data => {
            console.log(data)
            var uvi = document.createElement("Ui");
            var txtUvi = document.createTextNode("UV Index: " + data.current.uvi)
            uvi.appendChild(txtUvi);
            document.getElementById("uvIndex").appendChild(uvi);

            var windSpeed = document.createElement("Ui");
            var txtWind = document.createTextNode("Wind: " + data.current.wind_speed + " MPH")
            windSpeed.appendChild(txtWind);
            document.getElementById("windSpeed").appendChild(windSpeed)

            var Humidity = document.createElement("Ui");
            var txtHumidity = document.createTextNode("Humidity: " + data.current.humidity + " %")
            Humidity.appendChild(txtHumidity);
            document.getElementById("Humidity").appendChild(Humidity)

            var Temp = document.createElement("Ui");
            var txtTemp = document.createTextNode("Temp: " + data.current.temp + " ℉")
            Temp.appendChild(txtTemp);
            document.getElementById("Temperature").appendChild(Temp)

            var currentHeader = document.createElement("h2");
            var txtCurrentHeader = document.createTextNode(cityName + "(" + currentDate[0] + ")")
            currentHeader.appendChild(txtCurrentHeader);
            document.getElementById("CurrentConditions").appendChild(currentHeader)
        })
        var img = document.createElement("img");
        img.src = "https://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png";
        var src = document.getElementById("CurrentConditions");
        src.appendChild(img);
    });
};
