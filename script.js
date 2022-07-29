var form = $('form');
var APIkey = "5c085b58029041a21321c6f1c8df9a9b"

/*var btn = $('.btn');

btn.on('click', function() {
    console.log('please');
})*/

//fires on form submit (ie clicking the submit button)
form.on('submit', function(event) {
    event.preventDefault();
    let inputEl = $('#citysearch');
    let inputCity = inputEl.val().trim().toUpperCase();
    //get the weather
    getWeather(inputCity);
    //check to see if this city is already in search history
    if (!$(`#${inputCity}`).length) {
        //if it is not, add it to the history bar
        addCityButton(inputCity);
    }
    //reset the input field to empty
    inputEl.val('');
})

function addCityButton(cityName){
    //adds new city button below the form (in that column though)
    var historyContainer = $('.history');
    var newBtn = $('<button>');
    newBtn.addClass('btn btn-secondary');
    //sets id to the name of the city
    newBtn.attr('id',cityName);
    newBtn.text(cityName);
    historyContainer.prepend(newBtn); 

    //count cities in recent history. if>7, delete the first one
    let buttonElems = historyContainer.children();
    if (buttonElems.length>7) {
        buttonElems.last().remove();
    }
}

function getWeather(city) {
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey + '&units=imperial';
    let cityname;
    let wind;
    let humidity;
    let temp;
    let icon;
    fetch(queryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        //use moment.js to get current time/day
        let today = moment();
        //get variables from data
        cityname = data.name + ' (' + today.format('L') + ')';
        temp = data.main.temp;
        humidity = data.main.humidity;
        wind = data.wind.speed;
        icon = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
        //render current weather HTML
        var weatherContainer = $('.current-weather');
        var weatherHTML = `
            <h2 class="weather-head">${cityname}<img class="icon" src=${icon}></h2>
            <p class="temp">Temp: <span class="temp">${temp}</span>°F</p>
            <p>Wind Speed: <span class="wind">${wind}</span>MPH</p>
            <p>Humidity: <span class="humidity">${humidity}</span>%</p>
            <p class="uv">UV Index: <span class="uv-indicator"></span></p>`
        weatherContainer.html(weatherHTML);
    });


}


getWeather('philadelphia')




