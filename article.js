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
//  var onMouseMove = (mouseEvent) => getreports(mouseEvent)
 var onMouseMove = (mouseEvent) => reportsUnderMouse(mouseEvent)
 var onMouseMoveLeave = () => result.style.display = 'none'

function onMapClick(mouseEvent) {
    console.log("new click--------------------------------------------------------")
    //show position
    currentPoint =mouseEvent.latlng;
    console.log( "currentPoint = " + currentPoint);
    popupPosition(currentPoint);
    //reports
    // reportsOnClick(mouseEvent);
    getreports(mouseEvent)
}

/*
function onMapClick(mouseEvent) {
    currentPoint =mouseEvent.latlng;
    console.log(currentPoint);
    popupPosition(currentPoint);
    getreports(mouseEvent);
}*/

function onLocationFound(locEvent) {
    var radius = locEvent.accuracy;
    // var radius = locEvent.accuracy/35;
    var currentPosition = locEvent.latlng;
    mymap.setView(currentPosition,20);
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
// function xy(event) {
function xy() {
    var rect = document.querySelector("#mapid").getBoundingClientRect();
    //ratio = rapport entre la taille (verticale) d'un pixel physique sur le
    // périphérique d'affichage et la taille d'un pixel indépendant du matériel
    var mapWidth = rect.width * ratio;
    var mapHeight = rect.height * ratio;
    currentX = (event.clientX - rect.left) / (mapWidth / ratio); //coord x du pixel dans la map
    currentY = (event.clientY - rect.top) / (mapHeight / ratio); //coord y du pixel dans la map
    return [currentX,currentY];
    console.log("debug xy")
}

//====================REPORTS====================
//===============================================

var findReports = (x,y) => {
    var mapWidth = mapDiv.getBoundingClientRect().width * ratio;
    var reports = index.within(x, y, 5 * ratio / mapWidth);
    if(reports.length === 0){
        return [];
    }
    var distances = {};
    for(i of reports) {
        var dx = x - X[i][0], dy = y - X[i][1];
        distances[i] = dx * dx + dy * dy;
    }
    //first hundred sorted reports
    reports.sort((a, b) => ('' + Y[b]).localeCompare(Y[a])).slice(100);
    console.log(reports)
    return reports;
}

function showReportsOnEvent(event,reports) {
    if(reports.length = 0){
        console.log("showReportsOnEvent : no reports to show");
        result.innerText = "No reports to show";
        // return ;
    }
    if(true) {
        result.innerHTML = '';
        for (let r = 0; r < reports.length; r++) {
            console.log(Y[r])
            var p = document.createElement('p');
            p.innerHTML = Y[r];
            result.appendChild(p);
        }
    } else {
        var text = '';
        // for (let r = 0; r < reports.length; r++) {
        for(r of reports) {
            text += Y[r] + '\n';
            console.log(Y[r])
        }
        result.innerText = text;
    }
    result.scrollTo(0, 0);
    pin.style.left = '' + (event.clientX - 16) + 'px';
    pin.style.top = '' + (event.clientY - 48) + 'px';
    pin.style.display = '';
}

function reportsOnClick(clickEvent){
    if(clickEvent.type == 'click' || clickEvent.buttons != 0) {
        xy(clickEvent);
        // xy();
        console.log("last x = " + currentX)
        console.log("last y = " + currentY)
        clickedReports = findReports(currentX, currentY);
        showReportsOnEvent(clickEvent, clickedReports);
    }
}
function reportsUnderMouse(moveEvent) {
    if(moveEvent.type == 'mousemove' || moveEvent.buttons != 0) {
        //coordinates
        xy();
        console.log("last x = " + currentX)
        console.log("last y = " + currentY)
        //reports------------
        var reports = findReports(currentX,currentY);
        //display reports list
        showReportsOnEvent(moveEvent,reports);
    }
    console.log("reportsUnderMouse debug")
}

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

