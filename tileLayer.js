// layers-------------------------------------

var osm =L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
        attribution: 'Map data &copy; ' +
            '<a href="https://www.openstreetmap.org/">OpenStreetMap</a> ' +
            'contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © ' +
            '<a href="https://www.mapbox.com/">Mapbox</a>',
        minZoom: 1,
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibWF0ZXJlemEiLCJhIjoiY2s4bTUwaDA' +
            '5MDR5djNmcWZuc2x6eGVieiJ9.tp6oRueWBv6G9C8-F9pBMw'
    }
);

var stamenToner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
});

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var wikimedia = L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png', {
    attribution: '<a href="https://wikimediafoundation.org/wiki/Maps_Terms_of_Use">Wikimedia</a>',
    minZoom: 1,
    maxZoom: 19
});

var waterColor =  L.tileLayer('http://b.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
});

var transportLayer = L.tileLayer('http://openptmap.org/tiles/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="http://openptmap.org/" target="_blank" rel="noopener noreferrer">OpenPTMap</a> / <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OSM Contributors</a>',
    maxZoom: 22,
})

var grayScaleLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    id: 'mapbox.light',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
})


//isochronesOverlay
var matchingGradient = [
    "#79BBD2",
    "#71A6CE",
    "#788FC2",
    "#8676AD",
    "#925C8E",
    "#944367",
]
function isochronesLayer() {
    var isochronesLayerGroup = isochrones.isochrones.map((iso, idx) => {
        const color = matchingGradient[idx];
        return L.geoJSON(iso.geojson, {
            style: {
                fillColor: color,
                weight: 1,
                opacity: 0.9,
                color: color,
                fillOpacity: 0.8,
            }, attribution: '&copy; Navitia'
        });
    })
    return L.layerGroup(isochronesLayerGroup);
}

function legend() {
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = '<h4>Travel time legend</h4>'
        isochrones.isochrones.forEach((iso, idx, allTab) => {
            var text = toMin(iso.min_duration) + ' &dash; ' + toMin(iso.max_duration)
            div.innerHTML +=
                '<i style="background:' + matchingGradient[idx] + '"></i> ' +
                text + (idx !== allTab.length - 1 ? '<br>' : '');
        })
        return div;
    };
    return legend;
}

var isochronesOverlay = isochronesLayer();
var legendControl = legend();
isochronesOverlay.on('add',() => legendControl.addTo(map));
isochronesOverlay.on('remove', () => legendControl.remove());


// Station Saint Charles Marseille
var stationLat = 43.3036867;
var stationLng = 5.387961399999995;
var zoomLevel = 13;
// var mymap = L.map('mapid').setView([stationLat, stationLat], zoomLevel);
var stationMarker = L.marker(
    [stationLat, stationLng],
    {
        title: "Saint Charles"
    }
).bindPopup('Hello station');
var circle = L.circle([stationLat, stationLng], 2000, {color: 'red'});

// journey line
function toMin(durationInSec) {return Math.round((durationInSec / 60)) + 'min.'}
function journeyLine() {
    var multiLines = journey.journeys.map(j => {
        var latlngs = j.sections.map(s => {
            return s.geojson.coordinates.map(coord => {
                return [coord[1], coord[0]]
            })
        })
        var line = L.polyline(latlngs, {
            opacity: 0.8,
            dashArray: "2 12",
            color: 'yellow',
            weight: 10,
            attribution: '&copy; Navitia'
        }).bindPopup('Duration : ' + toMin(j.duration));
        line.on('mouseover', function () {
            line.setStyle({color: 'red'})
        })
        line.on('mouseout', function () {
            line.setStyle({color: 'yellow'})
        })
        return line
    })
    return L.layerGroup(multiLines);
}
var journeyOverlay = journeyLine();
var stationJourneyLayer = L.layerGroup([journeyOverlay, circle, stationMarker])

//control -----------------------------------------------
var controlLayer = L.control.layers({
    'Main': osm,
    'wikimedia': wikimedia,
    'Stamen layer': stamenToner,
    'Mapnik' : OpenStreetMap_Mapnik,
    'Water color': waterColor,
    'GrayScale': grayScaleLayer
    // 'Satellite': SatelliteLayer
}, {//overLayer
    // 'Travel time': isochronesOverlay,
    'Transport': transportLayer,
    'Station': stationJourneyLayer,
});