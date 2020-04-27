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
function onMapClick(mouseEvent) {
    console.log(currentPoint);
    currentPoint =mouseEvent.latlng;
    popupPosition(currentPoint);
    getreports(mouseEvent);
}

function onmousemove(mouseEvent) {
    getreports(mouseEvent);
}

function onLocationFound(locEvent) {
    var radius = locEvent.accuracy/10;
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

function onLocationError(errorEvent) {
    alert(errorEvent.message);
}
function popupPosition(point) {
    var msg = point.toString()
    popup.setLatLng(point).setContent(msg).openOn(mymap);
}

function getreports(e) {
    console.log(currentPoint.toString());
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
    console.log("debugg")
}
onmousemoveleave = (e) => result.style.display = 'none'

function draw_points() {
    var rect = document.querySelector("#mapid").getBoundingClientRect();
    // var rect = canvas.getBoundingClientRect();
    // var rect = document.getElementById("mapid").getBoundingClientRect();
    var ratio = window.devicePixelRatio || 1;
    var realWidth = rect.width * ratio;
    var realHeight = rect.height * ratio;
    canvas.width = realWidth;
    canvas.height = realHeight;
    var g = canvas.getContext('2d');
    for(i = 0; i < X.length; i++) {
        // var x = X[i][0] * width, y = X[i][1] * height;
        var x = latLng[1] * realWidth;
        var y = latLng[0] * realHeight;
        var shape = Array.isArray(point_shape) ? point_shape[i] : point_shape;
        var color = Array.isArray(point_color) ? point_color[i] : point_color;
        var size = Array.isArray(point_size) ? point_size[i] : point_size;
        g.fillStyle = color;
        g.beginPath();
        if(shape == 'square') {
            g.rect(x - size, y - size, 2 * size * ratio, 2 * size * ratio);
        } else {
            g.arc(x, y, size * ratio, 0, Math.PI * 2);
        }
        g.fill();
    }
    pin.style.display = 'none';
}
console.log("debugg")
