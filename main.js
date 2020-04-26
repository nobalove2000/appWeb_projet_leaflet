console.log("main.js");

function init(){
    const parcThabor = {
        lat: 48.114384,
        lng: -1.669494
    }
    const zoomLevel = 7;
    const map = L.map("mapid").setView([parcThabor.lat,parcThabor.lng],zoomLevel);
    const mainLayer = L.tileLayer(
        'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
            attribution: 'Map data &copy; ' +
                '<a href="https://www.openstreetmap.org/">OpenStreetMap</a> ' +
                'contributors, ' +
                '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                'Imagery © ' +
                '<a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoibWF0ZXJlemEiLCJhIjoiY2s4bTUwaDA' +
                         '5MDR5djNmcWZuc2x6eGVieiJ9.tp6oRueWBv6G9C8-F9pBMw'
        });
    mainLayer.addTo(map);
}


console.log("-----------fin main js---------------");