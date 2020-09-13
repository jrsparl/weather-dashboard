var apiKey = "appid=5d6b56704ff0276378f4c1f062f35e56"
var weatherContainerEl = document.querySelector("#current-weather-container");
var CurrentDate = moment();
var todayDate = "(" + moment(CurrentDate, "MM-DD-YYYY").format("MM/DD/YYYY") + ")";
var cityInputEl = document.querySelector("#city-search");
var cityFormEl = document.querySelector("#city-form");

var getCurrentWeather = function(city){
   
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&" + apiKey
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayWeather(data, city);
            });
        } else {
            alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        // Notice this `.catch()` getting chained onto the end of the `.then()` method
        alert("Unable to connect to Open Weather Source");
      });
    };



    var getUVIndex = function(lat, lon){
        //debugger
        var apiUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat +"&lon=" + lon + "&" + apiKey
        fetch(apiUrl).then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    //displayWeather(data, city);
                    var uvData = data;
                    debugger
                    console.log(uvData)
                    return uvData;
                });
            } else {
                alert("Error: " + response.statusText);
            }
          })
          .catch(function(error) {
            // Notice this `.catch()` getting chained onto the end of the `.then()` method
            alert("Unable to connect to Open Weather Source");
          });
        };






    var formSubmitHandler = function(event) {
        event.preventDefault();
        // get value from input element
        //debugger
        var city = cityInputEl.value.trim();
        if (city) {
            getCurrentWeather(city);
            cityInputEl.value = "";
        } else {
          alert("Please enter a city!");
        }
        
        console.log(event);
    };

var displayWeather = function(cityData, cityName){
    //debugger
    weatherContainerEl.textContent="";
    weatherContainerEl.classList = "card-body border border-secondary";
    var iconCode = cityData.weather[0].icon; 
    var weatherIcon = document.createElement("img")
    var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
    weatherIcon.setAttribute("src", iconurl)

    var weatherEl = document.createElement("h3")
    weatherEl.classList = "card-title";
    weatherEl.textContent = cityName + ' ' + todayDate;
    weatherEl.appendChild(weatherIcon)
    
    var weatherDetailsEl1 = document.createElement("p")
    weatherDetailsEl1.classList = "card-text"
    weatherDetailsEl1.textContent = "Temperature: " + cityData.main.temp + " " + "\xB0" + "f"

    var weatherDetailsEl2 = document.createElement("p")
    weatherDetailsEl2.classList = "card-text"
    weatherDetailsEl2.textContent = "Humidity: " + cityData.main.humidity + "%"

    var weatherDetailsEl3 = document.createElement("p")
    weatherDetailsEl3.classList = "card-text"
    weatherDetailsEl3.textContent = "Wind Speed: " + cityData.wind.speed + " MPH"

    
    var lat = cityData.coord.lat;
    var lon = cityData.coord.lon;
    var UVdata = function(lat, lon){
        getUVIndex(lat, lon)
    };
    debugger
    var uvIndex = UVdata.value
    var weatherDetailsEl3 = document.createElement("p")
    weatherDetailsEl3.classList = "card-text"
    weatherDetailsEl3.textContent = "UV Index: " + uvIndex



    weatherContainerEl.appendChild(weatherEl)
    weatherContainerEl.appendChild(weatherDetailsEl1)
    weatherContainerEl.appendChild(weatherDetailsEl2)
    weatherContainerEl.appendChild(weatherDetailsEl3)
    //console.log(cityData.main.temp + " " + "\xB0" + "f");
 
};

    //getCurrentWeather("Orlando");
    cityFormEl.addEventListener("submit", formSubmitHandler);