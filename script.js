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

//if you click on a city in history, load that up in search
$('.history').click(function(event) {
    //event bubble, make sure you clicked a button
    target = $(event.target)
    if (target.hasClass('btn')){
        let city = target.text();
        getWeather(city);
    }
})

function getWeather(city) {
    //initializing variables for simplpicity
    let cityname;
    let wind;
    let humidity;
    let temp;
    let uv;
    let icon;
    let lat;
    let long;
    let coordsquery = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIkey;
    let today = moment();
    //get city lat and long coords
    fetch(coordsquery)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        lat = data[0].lat.toFixed(2);
        long = data[0].lon.toFixed(2);
        let query = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=hourly,minutely,alerts&appid=" + APIkey;
        cityname = data[0].name + ' (' + today.format('L') + ')';

        //get weather data
        fetch(query)
        .then(function (response) {
            return response.json();
        })
        //current weather
        .then(function (data) {
            //get variables from data
            temp = data.current.temp;
            humidity = data.current.humidity;
            wind = data.current.wind_speed;
            uv = parseFloat(data.current.uvi);
            icon = 'http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png';
            let qual;
            //define uv quality
            if (uv<=2) {
                qual = 'low';
            }
            else if (uv<=6) {
                qual = 'mid';
            }
            else {
                qual = 'high'
            };
            //render current weather HTML
            var weatherContainer = $('.current-weather');
            let weatherHTML = `
                <h2 class="weather-head">${cityname}<img class="icon" src=${icon}></h2>
                <p class="temp">Temp: <span class="temp">${temp}</span>°F</p>
                <p>Wind Speed: <span class="wind">${wind}</span>MPH</p>
                <p>Humidity: <span class="humidity">${humidity}</span>%</p>
                <p class="uv">UV Index: <span class="uv-indicator ${qual}"> ${uv} </span></p>`;
            //set weather container's html to weatherHTML
            weatherContainer.html(weatherHTML);

            return data.daily
        })
        .then(function (data) {
            //if there is already weather here, delete it and reload it
            let forecastContainer = $('.forecast');
            if (forecastContainer.children().length){
                console.log('hello');
                forecastContainer.empty();
            }

            for (let index = 1; index <= 5; index++) {
                //get the correct day's weather data, starting tomorrow
                let info = data[index];
                let date = moment.unix(info.dt);
                temp = info.temp.max;
                humidity = info.humidity;
                wind = info.wind_speed;
                icon = 'http://openweathermap.org/img/wn/' + info.weather[0].icon + '@2x.png';
                let forecastHTML = `
                <div class="col bg-dark text-white m-2">
                    <h5>${date.format('L')}</h5>
                    <img class="icon" src="${icon}">
                    <p class="temp">Temp: <span class="temp">${temp}</span>°F</p>
                    <p>Wind Speed: <span class="wind">${wind}</span>MPH</p>
                    <p>Humidity: <span class="humidity">${humidity}</span>%</p>
                </div>`;
                
                forecastContainer.append(forecastHTML);
            }
        })
    })
    .catch(function (error) {
        var weatherContainer = $('.current-weather');
        let weatherHTML = '<h2 class="weather-head"> Something went wrong. Did you type a valid city name?</h2>';
        weatherContainer.html(weatherHTML);
        $('.forecast').empty();
    })
}

function getForecast(city) {
    //initialize variables for simplicity / lack of repetition
    let wind;
    let humidity;
    let temp;
    let icon;
    //call server for 5 days of weather data
    let forecastqueryURL = 'https://api.openweathermap.org/data/2.5/onecall?q=' + city + "&exclude=hourly,minutely,alerts" + "&appid=" + APIkey + '&units=imperial';
    fetch(forecastqueryURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        //now we have the forecast data
        let timeblockIndex = 0;
        let timeblockData;
        let dateobj = moment();
    //loop through the next 5 days
        for (let index = 1; index <= 5; index++) {
            let date = dateobj.add(1, 'days')
            //midday on date in unix epoch
            let middayUnix = date.startOf('day').add(11,'hours').unix();
            console.log('index is ' + index + ' timeblock index is ' + timeblockIndex + ' middayunix is ' + moment.unix(middayUnix).format("MMMM Do YYYY, h:mm:ss a"));
            //find the noon-ish timeblock by comparing the forecast time (in unix epoch) with middayUnix
            while (data.list[timeblockIndex].dt<middayUnix ) {
                console.log('while timeblock is ' + timeblockIndex + ' unix is ' + moment.unix(data.list[timeblockIndex].dt).format("dddd, MMMM Do YYYY, h:mm:ss a"));
                timeblockIndex++;
            }
            timeblockData = data.list[timeblockIndex];
            temp = timeblockData.main.temp;
            humidity = timeblockData.main.humidity;
            wind = timeblockData.wind.speed;
            icon = 'http://openweathermap.org/img/wn/' + timeblockData.weather[0].icon + '@2x.png';
            let forecastHTML = `
            <div class="day1 col bg-dark text-white">
                <h5>${date.format('L')}</h5>
                <img class="icon" src="${icon}">
                <p class="temp">Temp: <span class="temp">${temp}</span>°F</p>
                <p>Wind Speed: <span class="wind">${wind}</span>MPH</p>
                <p>Humidity: <span class="humidity">${humidity}</span>%</p>
            </div>`;
            let forecastContainer = $('.forecast');
            forecastContainer.html(forecastHTML);
        }
    })
}

getWeather('philadelphia');
//getForecast('philadelphia');




