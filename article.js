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
function onmousemove(mouseEvent) {
    currentPosition =mouseEvent.latlng
    L.marker(currentPosition).addTo(mymap)
        .bindPopup(currentPosition).openPopup();
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
// mouse event ----------------------------------
function showPosition(event) {
    var currentPosition = event.latlng;
    var errMsg = event.latlng.toString()
    L.marker(currentPosition).addTo(mymap).bindPopup(errMsg).openPopup();
}

function getreports(e) {
    console.log(latLng);
    if(e.type == 'click' || e.buttons != 0) {
        var rect = document.querySelector("#mapid").getBoundingClientRect();
        // var rect = mymap.getScale(div);

        //rapport entre la taille (verticale) d'un pixel physique sur le périphérique
        // d'affichage et la taille d'un pixel indépendant du matériel
        var ratio = window.devicePixelRatio || 1;
        var width = rect.width * ratio;
        var height = rect.height * ratio;
        var x = (e.clientX - rect.left) / (width / ratio); //coord x du pixel dans la map
        var y = (e.clientY - rect.top) / (height / ratio); //coord y du pixel dans la map
        var found = index.within(x, y, 5 * ratio / width);
        console.log(found)
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
onmousemoveleave = (e) => result.style.display = 'none'
function draw_points() {
    var rect = canvas.getBoundingClientRect();
    // var rect = document.getElementById("mapid").getBoundingClientRect();
    var ratio = window.devicePixelRatio || 1;
    var width = rect.width * ratio;
    var height = rect.height * ratio;
    canvas.width = width;
    canvas.height = height;
    var g = canvas.getContext('2d');
    for(i = 0; i < X.length; i++) {
        // var x = X[i][0] * width, y = X[i][1] * height;
        var x = latLng[1]    * width, y = latLng[0] * height;
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
