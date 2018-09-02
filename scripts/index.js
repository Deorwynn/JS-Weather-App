/* ================================================================*/
/*                       U I   E L E M E N T S
/* ================================================================*/

const UI = (function() {

    let menu = document.querySelector('#menu-container');
    
    // hide the loading screen and show the app
    const showApp = () => {
        document.querySelector('#app-loader').classList.add('hide');
        document.querySelector('main').removeAttribute('hidden');
    };

    // hide the app and show the loading screen
    const loadApp = () => {
        document.querySelector('#app-loader').classList.remove('hide');
        document.querySelector('main').setAttribute('hidden', true);
    };

    // show menu
    const _showMenu = () => menu.style.right = 0;

    // hide menu
    const _hideMenu = () => menu.style.right = '-65%';

    const toggleHourlyWeather = () => {
        let hourlyWeather = document.querySelector('#hourly-weather-wrapper'),
            arrow = document.querySelector('#btn-toggle').children[0],
            visible = hourlyWeather.getAttribute('visible'),
            dailyWeather = document.querySelector('#daily-weather-wrapper');

            if(visible == 'false') {
                hourlyWeather.setAttribute('visible', 'true');
                hourlyWeather.style.bottom = 0;
                arrow.style.transform = 'rotate(180deg)';
                dailyWeather.style.opacity = 0;
            }
            else if(visible == 'true') {
                hourlyWeather.setAttribute('visible', 'false');
                hourlyWeather.style.bottom = '-100%';
                arrow.style.transform = 'rotate(0deg)';
                dailyWeather.style.opacity = 1;
            }
            else {
                console.error('Unknown state of the hourly weather panel and visible attribute');
            }
    }

    const drawWeatherData = (data, location) => {
        console.log(data, location);

        let currentlyData = data.currently,
            dailyData = data.daily.data,
            hourlyData = data.hourly.data,
            weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dailyWeatherWrapper = document.querySelector('#daily-weather-wrapper'),
            dailyWeatherModel,
            day,
            maxMinTemp,
            dailyIcon,
            hourlyWeatherWrapper = document.querySelector('#hourly-weather-wrapper'),
            hourlyWeatherModel,
            hourlyIcon;

        // set current weather/location

        document.querySelectorAll('.location-label').forEach( (e) => {
            e.innerHTML = location;
        });

        // set the background
        document.querySelector('main').style.backgroundImage = `url("./images/bg-images/${currentlyData.icon}.jpg")`;

        // set icon
        document.querySelector('#currentlyIcon').setAttribute('src', `./images/summary-icons/${currentlyData.icon}-white.png`)

        // set summary
        document.querySelector('#summary-label').innerHTML = currentlyData.summary;

        // set temperature from Fahrenheit to Celsius
        document.querySelector('#degrees-label').innerHTML = Math.round((currentlyData.temperature - 32) * 5 / 9) + '&#176;';

        // set humidity
        document.querySelector('#humidity-label').innerHTML = Math.round(currentlyData.humidity * 100) + '%';

        // set wind speed
        document.querySelector('#wind-speed-label').innerHTML = Math.round(currentlyData.windSpeed * 1.6093).toFixed(1) + 'kph';

        // set daily weather
        while(dailyWeatherWrapper.children[1]) {
            dailyWeatherWrapper.removeChild(dailyWeatherWrapper.children[1]);
        }

        for(let i = 0; i<7; i++) {
            // clone the node and remove the 'hide' class
            dailyWeatherModel = dailyWeatherWrapper.children[0].cloneNode(true);
            dailyWeatherModel.classList.remove('hide');
            // set the day
            day = weekDays[new Date(dailyData[i].time * 1000).getDay()];
            dailyWeatherModel.children[0].children[0].innerHTML = day;
            // set minMax temperature for the upcoming days
            maxMinTemp = Math.round((dailyData[i].temperatureMax - 32) * 5 / 9) + '&#176;' + '/' + Math.round((dailyData[i].temperatureMin - 32) * 5 / 9) + '&#176;';
            dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;
            // set daily icon
            dailyIcon = dailyData[i].icon;
            dailyWeatherModel.children[1].children[1].children[0].setAttribute('src', `./images/summary-icons/${dailyIcon}-white.png`);
            // append the model
            dailyWeatherWrapper.appendChild(dailyWeatherModel);
        }

        dailyWeatherWrapper.children[1].classList.add(`current-day-of-the-week`);

        // set hourly weather
        while(hourlyWeatherWrapper.children[1]) {
            hourlyWeatherWrapper.removeChild(hourlyWeatherWrapper.children[1]);
        }

        for(let i = 0; i <= 24; i++) {
            // clone the node and remove 'hide' class
            hourlyWeatherModel = hourlyWeatherWrapper.children[0].cloneNode(true);
            hourlyWeatherModel.classList.remove('hide');
            // set hour
            hourlyWeatherModel.children[0].children[0].innerHTML = new Date(hourlyData[i].time * 1000).getHours() + ":00";
            // set temperature
            hourlyWeatherModel.children[1].children[0].innerHTML = Math.round((hourlyData[i].temperature - 32) * 5 / 9) + '&#176;';
            // set the icon
            hourlyIcon = hourlyData[i].icon;
            hourlyWeatherModel.children[1].children[1].children[0].setAttribute('src', `./images/summary-icons/${hourlyIcon}-grey.png`);
            // append model
            hourlyWeatherWrapper.appendChild(hourlyWeatherModel);
        }

        UI.showApp();
    }

    // menu events
    document.querySelector('#btn-open-menu').addEventListener('click', _showMenu);
    document.querySelector('#btn-close-menu').addEventListener('click', _hideMenu);

    // hourly-weather-wrapper events
    document.querySelector('#btn-toggle').addEventListener('click', toggleHourlyWeather);

    return {
        loadApp, 
        showApp,
        drawWeatherData
    }

})();

/* ================================================================*/
/*                    L O C A L   S T O R A G E
/* ================================================================*/

const LOCALSTORAGE = (function() {
    let savedCities = [];
    const save = (city) => {
        savedCities.push(city);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    };

    const get = () => {
        if(localStorage.getItem('savedCities') != null) {
            savedCities = JSON.parse(localStorage.getItem('savedCities'));
        }
    }

    const remove = (index) => {
        if(index < savedCities.length) {
            savedCities.splice(index, 1);
            savedCities = JSON.parse(localStorage.getItem('savedCities'));
        }
    }

    const getSavedCities = () => savedCities;

    return {
        save,
        get,
        remove,
        getSavedCities
    }

})();

/* ================================================================*/
/*                     G E T   L O C A T I O N
/* ================================================================*/

const getLocation = (function() {
    let location;
    const locationInput = document.querySelector('#location-input'),
          addCityBtn = document.querySelector('#btn-add-city');

    const _addCity = () => {
        location = locationInput.value;
        locationInput.value = '';
        addCityBtn.setAttribute('disabled', true);
        addCityBtn.classList.add('disabled');

        WEATHER.getWeather(location, true);
    }

    locationInput.addEventListener('input', function() {
        let inputText  = this.value.trim();

        if(inputText != '') {
            addCityBtn.removeAttribute('disabled');
            addCityBtn.classList.remove('disabled');
        }
        else {
            addCityBtn.setAttribute('disabled', true);
            addCityBtn.classList.add('disabled');
        }
    });

    addCityBtn.addEventListener('click', _addCity);

})();

/* ================================================================*/
/*                G E T   W E A T H E R   D A T A
/* ================================================================*/

const WEATHER = (function() {
    const darkSkyKey = 'ee7ad49692da9cfe41b15a490a420060',
          geocoderKey = '6b2f0498176c4d26ae6b4d137d3e8cc2';

    const _getGeoCodeURL = (location) => 
    `https://api.opencagedata.com/geocode/v1/json?q=${location}%2C%20UK&key=${geocoderKey}`;

    // CORS -> https://cors-anywhere.herokuapp.com/
    const _getDarkSkyURL = (lat, lng) => 
    `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyKey}/${lat},${lng}`;

    const _getDarkSkyData = (url, location) => {
        axios.get(url)
             .then( (res) => {
                console.log(res);
                UI.drawWeatherData(res.data, location);
             })
             .catch( (err) => {
                console.error(err);
            })
    }

    const getWeather = (location, save) => {
        UI.loadApp();
        let geocodeURL = _getGeoCodeURL(location);

        axios.get(geocodeURL)
             .then( (res) => {
                 if(res.data.results.length == 0) {
                     console.error('Invalid location');
                     UI.showApp();
                     return;
                 }

                 if(save) {
                     LOCALSTORAGE.save(location);
                 }

                let lat = res.data.results[0].geometry.lat,
                    lng = res.data.results[0].geometry.lng;
                let darkSkyURL = _getDarkSkyURL(lat, lng);
                _getDarkSkyData(darkSkyURL, location);
             })
             .catch( (err) => {
                console.log(err);
             })
    }

    return {
        getWeather
    }

})();

/* ================================================================*/
/*                             I N I T
/* ================================================================*/

window.onload = function() {
    LOCALSTORAGE.get();
    let cities = LOCALSTORAGE.getSavedCities();
    if(cities.length != 0) {
        WEATHER.getWeather(cities[cities.length - 1], false)
    }
    else UI.showApp();

}