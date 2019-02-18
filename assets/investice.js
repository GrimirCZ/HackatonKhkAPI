window.onload = () => {
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ3JpbWlyIiwiYSI6ImNqczV6YWk5ZzBqNWEzeW8zMHB0OHN6Nm4ifQ.7cTYHuE6hP_Lf03EWmzNOg', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);

    //L.marker([51.505, -0.09]).bindTooltip("new tooltip").addTo(map);

    fetch("/data/investice.geojson").then(async response => {
        const data = await response.json();
        console.log(data);
        L.geoJSON(data, {}).addTo(map);
    })
};

