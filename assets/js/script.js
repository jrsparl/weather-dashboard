var apiKey = "appid=5d6b56704ff0276378f4c1f062f35e56"
var weatherContainerEl = document.querySelector("#current-weather-container");
var CurrentDate = moment();
var todayDate = "(" + moment(CurrentDate, "MM-DD-YYYY").format("MM/DD/YYYY") + ")";
var cityInputEl = document.querySelector("#city-search");
var cityFormEl = document.querySelector("#city-form");
var fiveDayContainerEl = document.querySelector("#extended-forecast-container");
var fiveDayTileEl = document.querySelector("#five-day-title")
var cityListEl = document.querySelector("#city-list-items")

var getCurrentWeather = function(city, isCityStored){
   
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&" + apiKey
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                if (isCityStored){
                    displayWeather(data, city);
                } else {
                    storeCity(city)
                    displayWeather(data, city);
                };
                
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


var getFiveDayForecast = function(lat, lon){
    var apiUrl3 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +"&lon="+lon+"&exclude=current,minutely,hourly&units=imperial&" + apiKey
    fetch(apiUrl3).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayFiveDayForecast(data);
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
        var apiUrl2 = "https://api.openweathermap.org/data/2.5/uvi?" + apiKey +"&lat=" + lat + "&lon=" + lon
        //debugger
        fetch(apiUrl2).then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    //displayWeather(data, city);
                    var uvData = data;
                    //debugger
                    console.log(uvData)
                    //debugger
                    displayUVindex(uvData);
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


            var addCity = document.createElement("li")
            addCity.classList = "list-group-item flex-row justify-space-between align-center"
            addCity.textContent = city
            cityListEl.appendChild(addCity)

            var isCityStored = false
            getCurrentWeather(city, isCityStored);
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
    var iconurl = "https://openweathermap.org/img/w/" + iconCode + ".png";
    weatherIcon.setAttribute("src", iconurl)

    var weatherEl = document.createElement("h3")
    weatherEl.classList = "card-title";
    weatherEl.textContent = cityName + ' ' + todayDate;
    weatherEl.appendChild(weatherIcon)
    
    var weatherDetailsEl1 = document.createElement("p")
    weatherDetailsEl1.classList = "card-text"
    weatherDetailsEl1.textContent = "Temperature: " + cityData.main.temp + " " + "\xB0" + "F"

    var weatherDetailsEl2 = document.createElement("p")
    weatherDetailsEl2.classList = "card-text"
    weatherDetailsEl2.textContent = "Humidity: " + cityData.main.humidity + "%"

    var weatherDetailsEl3 = document.createElement("p")
    weatherDetailsEl3.classList = "card-text"
    weatherDetailsEl3.textContent = "Wind Speed: " + cityData.wind.speed + " MPH"

    
    var lat = cityData.coord.lat;
    var lon = cityData.coord.lon;
    //debugger
    //var UVdata = getUVIndex(lat, lon);
    //console.log(UVdata)
    //debugger
    //var uvIndex = UVdata.value
    var weatherDetailsEl3 = document.createElement("p")
    weatherDetailsEl3.classList = "card-text"
    weatherDetailsEl3.textContent = "UV Index: "
    var UVspanEl = document.createElement("span")
    UVspanEl.setAttribute("id", "UV-span")
    weatherDetailsEl3.appendChild(UVspanEl)

    weatherContainerEl.appendChild(weatherEl)
    weatherContainerEl.appendChild(weatherDetailsEl1)
    weatherContainerEl.appendChild(weatherDetailsEl2)
    weatherContainerEl.appendChild(weatherDetailsEl3)
    //console.log(cityData.main.temp + " " + "\xB0" + "f");
    getUVIndex(lat, lon);
    getFiveDayForecast(lat, lon);
};

var displayUVindex = function(uvData){
    var uvSpanId = document.querySelector("#UV-span")
    uvSpanId.textContent = uvData.value
    if (uvData.value < 3){
        uvSpanId.classList = "bg-success p-2 text-light rounded"
    }else if(uvData.value < 8 && uvData.value > 2){
        uvSpanId.classList = "bg-warning p-2 text-light rounded"
    }else{
        uvSpanId.classList = "bg-danger p-2 text-light rounded"
    }
}
var displayFiveDayForecast = function(fiveDayData){
    console.log(fiveDayData);
    fiveDayContainerEl.textContent = ""
    fiveDayTileEl.textContent = ""
    var fiveDayTitle = document.createElement("h3")
    fiveDayTitle.classList = "text-left text-dark"
    fiveDayTitle.textContent = "5-Day Forecast:"
    fiveDayTileEl.appendChild(fiveDayTitle)
    
    for (var i=1; i < 6; i++ ){
        var dateString = moment.unix(fiveDayData.daily[i].dt).format("MM/DD/YYYY");
        
        var wIconId= fiveDayData.daily[i].weather[0].icon
     
        var temp = fiveDayData.daily[i].temp.max + " " + "\xB0" + "F"

        var humidPercentage = fiveDayData.daily[i].humidity +"%"
   
        //create card
        var fiveDayCard = document.createElement("div")
        fiveDayCard.classList = "col-lg-2 col-md-4 col-sm-12 m-2 bg-primary card rounded"
        //create card title
        var cardTitle = document.createElement("h5")
        cardTitle.classList = "text-light"
        cardTitle.textContent = dateString
        fiveDayCard.appendChild(cardTitle)
        //append card image
        var cardImage = document.createElement("img")
        var iconurl = "https://openweathermap.org/img/w/" + wIconId + ".png";
        cardImage.setAttribute("src", iconurl)
        fiveDayCard.appendChild(cardImage)
        //append temp p
        var tempP = document.createElement("p")
        tempP.classList = "text-light"
        tempP.textContent = "Temp: " + temp
        fiveDayCard.appendChild(tempP)
        //append humidity
        var humidP = document.createElement("p")
        humidP.classList = "text-light"
        humidP.textContent = "Humidity: " + humidPercentage
        fiveDayCard.appendChild(humidP)

        fiveDayContainerEl.appendChild(fiveDayCard)
        

    }
};

var getCityfromList = function(event){
    var cityText = $(event.target).text();
    var isCityStored = true
    getCurrentWeather(cityText, isCityStored)
}


var storeCity = function(City){
    
    let cities;
    if(localStorage.getItem('cities')===null){
        cities = [];
    } else{
        cities = JSON.parse(localStorage.getItem('cities'))
    }

    cities.push(City);
    localStorage.setItem('cities', JSON.stringify(cities))

};



var getCities = function(){

    if(localStorage.getItem('cities')===null){

    } else{
        cities = JSON.parse(localStorage.getItem('cities'))
        for(var i=0; i < cities.length; i++){
            var addCity = document.createElement("li")
            addCity.classList = "list-group-item flex-row justify-space-between align-center"
            addCity.textContent = cities[i]
            cityListEl.appendChild(addCity)
        }
    }
}


//getCurrentWeather
    //getCurrentWeather("Orlando");
    cityFormEl.addEventListener("submit", formSubmitHandler);
    cityListEl.addEventListener("click", getCityfromList);
    getCities();