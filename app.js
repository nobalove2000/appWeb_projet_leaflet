console.log("app.js loaded")

var point_color = "rgba(0,0,0,0.25)";
var point_size = 1;
var point_shape = "circle";

//====================HTML ELEMENT====================
//====================================================
var body = document.querySelector("body");
var mapDiv = document.querySelector("#mapid");
var result = document.getElementById("result:16154530610149117952");
var pin = document.getElementById("pin:16154530610149117952");

//====================STYLE ELEMENT====================
//====================================================
var currentX, currentY;
var ratio = window.devicePixelRatio || 1;
var lat = 43.3, long = 5.4, zoomLevel = 13, marseille =L.latLng(lat, long);
var mymap = L.map('mapid').setView(marseille, zoomLevel);
var currentPoint = marseille;
var clickedReports;
var popup = L.popup();

//====================LAYER====================
//=============================================
osm.addTo(mymap);
controlLayer.addTo(mymap);

//====================AUTO LOCALISATION====================
//=========================================================
locate(mymap);
gelocButton.addTo(mymap);

//====================EVENT LISTENNER====================
//====================================================
mymap.on('click', onMapClick);
mymap.on('mousemove', onMouseMove);
mymap.on('mousemoveleave', onMouseMoveLeave);

var index = new KDBush(X);
//draw_points();
//window.onresize = draw_points;

