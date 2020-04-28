 console.log("article.js loaded");



//====================AUTO LOCALISATION====================
//=========================================================
function locate(map) {
    map.locate({setView: true, maxZoom:0});
    mymap.on('locationfound', onLocationFound);
    mymap.on('locationerror', onLocationError);
}


// locate button ----------------------------------
var gelocButton = L.control({position : 'topright'});
gelocButton.onAdd = (map) =>{
    var button = L.DomUtil.create(
        'button', //tagName
        'geloc-button' //className
        //optionally third param is the container element where to append the button
    );
    button.innerText = "Locate";
    button.onclick = () => {
        button.disabled = true;
        locate(map);
        button.disabled = false;
    }
    return button;
}

//====================ACTION EVENT====================
//====================================================
 var onMouseMove = (mouseEvent) => getreports(mouseEvent)
 // var onMouseMove = (mouseEvent) => reportsUnderMouse(mouseEvent)
 var onMouseMoveLeave = (mouseEvent) => result.style.display = 'none'

function onMapClick(mouseEvent) {
    //show position
    currentPoint =mouseEvent.latlng;
    console.log(currentPoint);
    popupPosition(currentPoint);
}

/*
function onMapClick(mouseEvent) {
    currentPoint =mouseEvent.latlng;
    console.log(currentPoint);
    popupPosition(currentPoint);
    getreports(mouseEvent);
}*/

function onLocationFound(locEvent) {
    var radius = locEvent.accuracy/35;
    var currentPosition = locEvent.latlng;
    mymap.setView(currentPosition,16);
    L.marker(currentPosition).addTo(mymap)
        .bindPopup("My position " + currentPosition).openPopup();
    L.circle(currentPosition, {
        color: 'rgba(16,68,36,0.93)',
        fillColor: '#89925c',
        fillOpacity: 0.5,
        radius: radius
    }).addTo(mymap);
}

var onLocationError = (errorEvent) => alert(errorEvent.message);

//====================POSITION====================
//================================================
function popupPosition(point) {
    var msg = point.toString()
    popup.setLatLng(point).setContent(msg).openOn(mymap);
}

 /**
  * converts xy from window into xy in the map div
  */
function xy() {
    var rect = document.querySelector("#mapid").getBoundingClientRect();
    //ratio = rapport entre la taille (verticale) d'un pixel physique sur le
    // périphérique d'affichage et la taille d'un pixel indépendant du matériel
    var mapWidth = rect.width * ratio;
    var mapHeight = rect.height * ratio;
    currentX = (event.clientX - rect.left) / (mapWidth / ratio); //coord x du pixel dans la map
    currentY = (event.clientY - rect.top) / (mapHeight / ratio); //coord y du pixel dans la map
    return [currentX,currentY];
}

//====================REPORTS====================
//===============================================
/*
var findreports = (x,y) => {
    // reports = [];
    var mapWidth = mapDiv.getBoundingClientRect().width * ratio;
    var reports = index.within(x, y, 5 * ratio / mapWidth);
    var distances = {};
    for(i of reports) {
        var dx = x - X[i][0], dy = y - X[i][1];
        distances[i] = dx * dx + dy * dy;
    }
    reports.sort((a, b) => ('' + Y[b]).localeCompare(Y[a])).slice(100);
    return reports;
}

function showReportsOnEvent(event,reports) {
    reports = [];
    if(true) {
        result.innerHTML = '';
        for(r of reports) {
            var p = document.createElement('p');
            p.innerHTML = Y[r];
            result.appendChild(p);
        }
    } else {
        var text = '';
        for(r of reports) {
            text += Y[r] + '\n';
        }
        result.innerText = text;
    }
    result.scrollTo(0, 0);
    pin.style.left = '' + (event.clientX - 16) + 'px';
    pin.style.top = '' + (event.clientY - 48) + 'px';
    pin.style.display = '';
}

function reportsOnClick(mouseEvent){
    if(mouseEvent.type == 'click' || mouseEvent.buttons != 0) {
        xy();
        clickedReports = findreports(currentX, currentY);
        showReportsOnEvent(mouseEvent, clickedReports);
    }
}
function reportsUnderMouse(event) {
    if(event.type == 'click' || event.buttons != 0) {
        //coordinates
        xy();
        //reports------------
        var reports = findreports(currentX,currentY);
        //display reports list
        showReportsOnEvent(event,reports);
    }
}
*/

function getreports(e) {
     if(e.type == 'click' || e.buttons != 0) {
         var rect = document.querySelector("#mapid").getBoundingClientRect();
         // var rect = mymap.getScale(div);

         //ratio = rapport entre la taille (verticale) d'un pixel physique sur le
         // périphérique d'affichage et la taille d'un pixel indépendant du matériel
         var ratio = window.devicePixelRatio || 1;
         var realWidth = rect.width * ratio;
         var realHeight = rect.height * ratio;
         var x = (event.clientX - rect.left) / (realWidth / ratio); //coord x du pixel dans la map
         var y = (event.clientY - rect.top) / (realHeight / ratio); //coord y du pixel dans la map
         var found = index.within(x, y, 5 * ratio / realWidth);
         console.log("found = " + found)
         var distances = {};
         for(i of found) {
             var dx = x - X[i][0], dy = y - X[i][1];
             distances[i] = dx * dx + dy * dy;
         }
         found.sort((a, b) => ('' + Y[b]).localeCompare(Y[a])).slice(100);
         if(true) {
             result.innerHTML = '';
             for(i of found) {
                 var div = document.createElement('p');
                 div.innerHTML = Y[i];
                 result.appendChild(div);
             }
         } else {
             var text = '';
             for(i of found) {
                 text += Y[i] + '\n';
             }
             result.innerText = text;
         }
         result.scrollTo(0, 0);
         pin.style.left = '' + (e.clientX - 16) + 'px';
         pin.style.top = '' + (e.clientY - 48) + 'px';
         pin.style.display = '';
     }
 }
