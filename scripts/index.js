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

    // menu events
    document.querySelector('#btn-open-menu').addEventListener('click', _showMenu);
    document.querySelector('#btn-close-menu').addEventListener('click', _hideMenu);

    // hourly-weather-wrapper events
    document.querySelector('#btn-toggle').addEventListener('click', toggleHourlyWeather);

    return {
        loadApp, 
        showApp
    }

})();

/* ================================================================*/
/*                             I N I T
/* ================================================================*/

window.onload = function() {
    UI.showApp();
}