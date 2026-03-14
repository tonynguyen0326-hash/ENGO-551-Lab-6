// create map of city of Calgary
var map = L.map('map').setView([51.04619055613446,-114.06160542305022], 10);

// add tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// store drawn layers
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// add draw toolbar
var drawControl = new L.Control.Draw({
    // make sure only lines can be drawn
    draw: {
        polyline: true,
        simpleshape: false,
        polygon: false,
        marker: false,
        circlemarker: false,
        circle: false,
        rectangle: false,
    },
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);

// create layer for drawings
var layer;

// when user is done drawing
map.on(L.Draw.Event.CREATED, function(e) {
    
    // get what user drew
    layer = e.layer;

    // remove old drawings
    drawnItems.clearLayers();

    // add new drawings
    drawnItems.addLayer(layer);
});

// create simplify layer
var simplify;

// when Simplify Line button clicked
document.getElementById("simplifyButton").onclick = function(){

    // check if line is drawn
    if (!layer){
        alert("Draw a line first!");
        return;
    }

    // create GeoJSON
    var geojson = layer.toGeoJSON(); 

    // use simplify function
    var simplified = turf.simplify(geojson);

    // remove old simplified layer
    if (simplify){
        map.removeLayer(simplify);
    }

    // add new simplified layer to map
    simplify = L.geoJSON(simplified).addTo(map);
}

// when reset button clicked
document.getElementById("reset").onclick = function(){

    // clear lines
    drawnItems.clearLayers();

    // clear simplified lines
    if(simplify){
        map.removeLayer(simplify);
    }

    // make layers empty
    layer = null;
    simplify = null;
}