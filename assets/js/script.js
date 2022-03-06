var formInputEl = document.getElementById('input')
var userFormEl = document.getElementById('input-form')
var currentCity = document.getElementById('city-name')
var recentSearchBox = document.getElementById('recent-search')

// Use input value to populate geocodeAPI
function formSubmitHandler(event) {
 event.preventDefault();
 var cityName = formInputEl.value.trim();

 if (cityName) {
  getCityName(cityName);
  formInputEl.value = ""
 }
 else {
  alert("Please Enter a City Name")
 }
 console.log(event)
 currentCity.textContent = cityName
 localStorage.setItem("city", JSON.stringify(cityName))
  var searchHistory = JSON.parse(localStorage.getItem("city"))
  
  var recentSearch = document.createElement('button')
  recentSearch.setAttribute("class", "btn btn-dark btn-block")
  recentSearch.setAttribute("type", "submit")
  recentSearch.setAttribute("value", cityName)
  recentSearch.textContent = searchHistory
  
  recentSearchBox.appendChild(recentSearch)
  
  console.log(recentSearch.value)
}

userFormEl.addEventListener("submit", formSubmitHandler)


// function to input city name into geocode api
function getCityName(city) {
 const clearWrapper = document.getElementById('card-wrap')
 clearWrapper.remove()


 var geocodeApi = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=90fb50fac270c54c352e49a47c6e77fa"

 // make url request
 fetch(geocodeApi)
  .then(response => response.json())
  .then(response => {
   var lat = response[0].lat;
   var lon = response[0].lon;
   var weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=90fb50fac270c54c352e49a47c6e77fa`
   return fetch(weatherApi)
  })
  .then(response => response.json())
  .then(({daily}) => {
   const forecast = document.getElementById('forecast')
   const wrapper = document.createElement('div')
   wrapper.id = "card-wrap"
   wrapper.setAttribute("class", "row justify-content-center ")
   forecast.appendChild(wrapper)


  // for loop to run through 5 day forecast
   for (var i = 1; i <= 5; i++) {
    console.log(daily[i])
    const div = document.createElement('div')
    div.setAttribute('class', 'card m-3 border border-dark')
    wrapper.appendChild(div)

    const div2 = document.createElement('div')
    div2.setAttribute('class', 'card-body p-3')
    div.appendChild(div2)

    const h5 = document.createElement('h5')
    h5.setAttribute('class', 'card-title')
    const today = daily[i].dt.toString() + '000'
    h5.textContent = $.datepicker.formatDate("mm/dd/yy", new Date(parseInt(today, 10)) ) //new Date(+today).toISOString().slice(0,10)
    div2.appendChild(h5)

    const div3 = document.createElement('img')
    const icon = daily[i].weather[0].icon
    div3.setAttribute('src', `./assets/icons/${icon}.png`)
    div2.appendChild(div3)
    
     // Weather Variables
   var temp = daily[i].temp.day
   var wind = daily[i].wind_speed
   var humidity = daily[i].humidity

    const p1 = document.createElement('p')
    //div.setAttribute('class', 'card-text')
    div2.appendChild(p1)
    p1.textContent = "Temp: " + temp + "°F"

    const p2 = document.createElement('p')
    //div.setAttribute('class', 'card-text')
    div2.appendChild(p2)
    p2.textContent = "Wind: " + wind + "mph"

    const p3 = document.createElement('p')
    //div.setAttribute('class', 'card-text')
    div2.appendChild(p3)
    p3.textContent = "Humidity: " + humidity + "%"

   }


   
   var currentTemp = document.getElementById('temp')
   var currentWind = document.getElementById('wind')
   var currentHumidity = document.getElementById('humidity')
   var currentUV = document.getElementById('uv')
   //!currentUV.setAttribute("class", "p-1 border border-dark")

   currentTemp.textContent = "Temp: " + daily[0].temp.day + "°F"
   currentWind.textContent = "Wind: " + daily[0].wind_speed + "mph"
   currentHumidity.textContent = "Humidity: " + daily[0].humidity + "%"
   currentUV.textContent = "UV-Index: " + daily[0].uvi 

   if (daily[0].uvi >= 0 && daily[0].uvi < 3) {
    currentUV.setAttribute("class", "safe")
   }
   else if(daily[0].uvi >= 3 && daily[0].uvi < 6) {
    currentUV.setAttribute("class", "medium")
   }
   else if(daily[0].uvi >= 6 && daily[0].uvi < 9) {
    currentUV.setAttribute("class", "danger")
   }
   else{
    currentUV.setAttribute("class", "getout")
   }
  })
}


 
 

// Store input history in local storage and createElements to populate the history area
var citySearch = formInputEl.value.trim()


// Populate the current weather box with the correct city and variables

// Populate the forecast cards with the 5 day forecast