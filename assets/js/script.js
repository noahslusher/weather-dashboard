var formInputEl = document.getElementById('input')
var userFormEl = document.getElementById('input-form')
var currentCity = document.getElementById('city-name')
var currentDate = document.getElementById('current-date')
var recentSearchBox = document.getElementById('recent-search')

// Hide weather box before search
$('#weather-box').hide()


// User input function
function formSubmitHandler(event) {
 event.preventDefault();
 var cityName = formInputEl.value.trim();
 // Make sure there is input in the search bar
 if (cityName) {
  getCityName(cityName);
  // remove text input after search
  formInputEl.value = ""
 }
 else {
  alert("Please Enter a City Name")
 }
 // Add text to the current forecast box
 currentCity.textContent = cityName
 //Commit search term to localstorage
 localStorage.setItem("city", JSON.stringify(cityName))
 // Do not create empty button if there is no user input
 if (cityName) {
 getSearchCity()
 }
 else {
 }
 //Show weather box after search
 $('#weather-box').show()
}



function getSearchCity () {
 // Pull from Local Storage
 var searchHistory = JSON.parse(localStorage.getItem("city"))
// Create buttons for each search
 var recentSearch = document.createElement('a')
 recentSearch.setAttribute("class", "btn btn-dark btn-block")
 // Set button text to local storage value
 recentSearch.textContent = searchHistory
 // Append to recent search box area
 recentSearchBox.appendChild(recentSearch)
 // Make the recent search buttons work after clicking them
 recentSearch.addEventListener("click", function(event) {
  // Pass the button's city name to getCityName function
  getCityName(event.target.textContent)
  // Populate currentCity with button city name
  currentCity.textContent = event.target.textContent
  $('#weather-box').show()
 })
}

// Call formSubmitHandler() on button submit
userFormEl.addEventListener("submit", formSubmitHandler)

 
// Function to input city name into geocode api and feed lat and lon into weather API then display results
function getCityName(city) {
 // Clear the forecast boxes after each search
 const clearWrapper = document.getElementById('card-wrap')
 clearWrapper.remove()
 // API to get lat and lon from city name
 var geocodeApi = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=90fb50fac270c54c352e49a47c6e77fa"
 // make url request
 fetch(geocodeApi)
  .then(response => response.json())
  .then(response => {
   var lat = response[0].lat;
   var lon = response[0].lon;
   // input lat and lon into weather API
   var weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=90fb50fac270c54c352e49a47c6e77fa`
   return fetch(weatherApi)
  })
  .then(response => response.json())
  .then(({ daily }) => {
   const forecast = document.getElementById('forecast')
   const wrapper = document.createElement('div')
   wrapper.id = "card-wrap"
   wrapper.setAttribute("class", "row justify-content-center ")
   forecast.appendChild(wrapper)

   // for loop to run through 5 day forecast
   for (var i = 1; i <= 5; i++) {
    // Set the current date underneath the chosen city name
    currentDate.textContent = $.datepicker.formatDate("mm/dd/yy", new Date(parseInt(daily[0].dt.toString() + '000', 10)))

    // Create area to hold 5-day forecast cards
    const div = document.createElement('div')
    div.setAttribute('class', 'card m-3 border border-dark')
    wrapper.appendChild(div)

    // Creating card elements based off 5 day forecast
    const div2 = document.createElement('div')
    div2.setAttribute('class', 'card-body p-3 text-black')
    div.appendChild(div2)
    // Card header
    const h5 = document.createElement('h5')
    h5.setAttribute('class', 'card-title')
    const today = daily[i].dt.toString() + '000'
    h5.textContent = $.datepicker.formatDate("mm/dd/yy", new Date(parseInt(today, 10))) //new Date(+today).toISOString().slice(0,10)
    div2.appendChild(h5)
    // Weather icon
    const div3 = document.createElement('img')
    const icon = daily[i].weather[0].icon
    div3.setAttribute('src', `./assets/icons/${icon}.png`)
    div2.appendChild(div3)

    // Weather Variables
    var temp = daily[i].temp.day
    var wind = daily[i].wind_speed
    var humidity = daily[i].humidity
    // Temp information
    const p1 = document.createElement('p')
    div2.appendChild(p1)
    p1.textContent = "Temp: " + temp + "°F"
    // Wind information
    const p2 = document.createElement('p')
    div2.appendChild(p2)
    p2.textContent = "Wind: " + wind + "mph"
    // Humidity Information
    const p3 = document.createElement('p')
    div2.appendChild(p3)
    p3.textContent = "Humidity: " + humidity + "%"
   }

   // Set variables for weather information in current forecast box
   var currentTemp = document.getElementById('temp')
   var currentWind = document.getElementById('wind')
   var currentHumidity = document.getElementById('humidity')
   var currentUV = document.getElementById('uv')
   // Add weather information to current forecast box
   currentTemp.textContent = "Temp: " + daily[0].temp.day + "°F"
   currentWind.textContent = "Wind: " + daily[0].wind_speed + "mph"
   currentHumidity.textContent = "Humidity: " + daily[0].humidity + "%"
   currentUV.textContent = "UV-Index: " + daily[0].uvi
   // Create colors based on UV Index
   if (daily[0].uvi >= 0 && daily[0].uvi < 3) {
    currentUV.setAttribute("class", "safe")
   }
   else if (daily[0].uvi >= 3 && daily[0].uvi < 6) {
    currentUV.setAttribute("class", "medium")
   }
   else if (daily[0].uvi >= 6 && daily[0].uvi < 9) {
    currentUV.setAttribute("class", "danger")
   }
   else {
    currentUV.setAttribute("class", "getout")
   }
  })
}


getSearchCity()

