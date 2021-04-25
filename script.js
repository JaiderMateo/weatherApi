const weatherdDiv = document.querySelector('#weatherTags');
const inputDiv = document.querySelector('#serachInput');
const buttonDiv = document.querySelector('#button');
const keyURL = '38796e1b1226485895c4f896ee623877';
const url = new URL('https://api.weatherbit.io/v2.0/current');
let city;
let lat;
let lon;

// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = 'pk.eyJ1IjoiamFpZGVybWF0ZW9zb3RvIiwiYSI6ImNrbnc5OHFlazB1Z2cyd21rcXlqeGR3dGsifQ.2i-XsE7yncaoYyzv02fQ_w';
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
map.on('click', function (e) {
    lat = e.lngLat.lat;
    lon = e.lngLat.lng;
    urlMakerByCoords()
    document.getElementById('info').innerHTML =
    // e.point is the x, y coordinates of the mousemove event relative
    // to the top-left corner of the map
    JSON.stringify(e.point) +
    '<br />' +
    // e.lngLat is the longitude, latitude geographical position of the event
    JSON.stringify(e.lngLat.wrap());
});


function urlMakerByCity(){
    city = inputDiv.value;
    url.searchParams.set('city', city);
    url.searchParams.set('key', keyURL);
    request();
}

async function currentLocation(){
    window.navigator.geolocation.getCurrentPosition( (result)=>{
        lat = result.coords.latitude;
        lon = result.coords.longitude;
        urlMakerByCoords();
    })
}

function urlMakerByCoords(){
    url.searchParams.set('lat', lat);
    url.searchParams.set('lon', lon);
    url.searchParams.set('key', keyURL);
    request();
}


function request(){
    fetch(url)
    .then((response)=>response.json())
    .then((json)=>{
        let weatherTag = document.createElement('div');
        weatherTag.className = "weatherTag";
        let cityNameDiv = document.createElement('h5');
        cityNameDiv.className = "city"
        let temperatureDiv = document.createElement('div');
        let uvDiv = document.createElement('div');
        let timeZoneDiv = document.createElement('div');
        let weatherIconDiv = document.createElement('img');
        weatherIconDiv.className = "icon";


        const weather = json.data[0];
        const weatherIcon = weather.weather.icon;
        const weatherIconURL = `https://www.weatherbit.io/static/img/icons/${weatherIcon}.png`;
        const cityName = weather.city_name;
        const temperature = weather.temp;
        const uv = weather.uv;
        const timezone = weather.timezone;
        lat = weather.lat;
        lon = weather.lon;
        cityNameDiv.innerText = cityName;
        temperatureDiv.innerText = temperature;
        uvDiv.innerText = uv;
        timeZoneDiv.innerText = timezone;
        weatherIconDiv.src = weatherIconURL;

        weatherTag.append(cityNameDiv, uvDiv, weatherIconDiv, temperatureDiv, timeZoneDiv);
        weatherdDiv.appendChild(weatherTag);
        createMaker();
    })
}

function createMaker(){
    let marker = new mapboxgl.Marker()
    .setLngLat([lon, lat])
    .addTo(map)   
}


buttonDiv.addEventListener('click', urlMakerByCity)
currentLocation();

//https://account.mapbox.com/
//https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker#getlnglat
//https://www.weatherbit.io/api/weather-current