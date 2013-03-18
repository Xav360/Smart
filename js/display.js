/**
 * @author Hugues Pouillot
 */

var map;
var edgePath;

function display(json) {

    var min = Math.floor(json.travelInfo.time/60);
    var dist = Math.floor(json.travelInfo.distance/1000);

    $('#travelTime').text(min + " min");
    $('#travelDistance').text(dist + " km");

    var myIconA = L.icon({
        iconUrl: 'image/A-position.png',
        iconRetinaUrl: 'image/A-position.png',
        iconSize: [33, 40],
        iconAnchor: [16, 40]
    });

    var myIconB = L.icon({
        iconUrl: 'image/B-position.png',
        iconRetinaUrl: 'image/B-position.png',
        iconSize: [33, 40],
        iconAnchor: [16, 40]
    });



    var edges = [];
    var pointList = json.steps ;

    if (!edgePath==null) {
        edgePath.setMap(null);
    }

    var BMarker = new L.marker([pointList[0].lat,pointList[0].lon], {icon : myIconB});
    BMarker.addTo(map);

    var AMarker = new L.marker([pointList[pointList.length-2].lat,pointList[pointList.length-2].lon], {icon : myIconA});
    AMarker.addTo(map);

    for (var i =0; i<pointList.length-1; i++){
        edges.push(new L.LatLng(pointList[i].lat,pointList[i].lon));
    }

    map.fitBounds([
        [pointList[0].lat, pointList[0].lon],
        [pointList[pointList.length-1].lat, pointList[pointList.length-1].lon]
    ]);

    var myStyle = {
        "color": "#1E00FF",
        "weight": 8,
        "opacity": 0.70,
        "smoothFactor":0.1
    };

    L.polyline(edges, myStyle).addTo(map);
}

function submitform()
{//this check triggers the validations
    codeAddress($("#adr2").val(), getPath);
}

function getPath(point){
   var url="http://127.0.0.1:8080/rest/routing?lat1="+userMarker.getLatLng().lat+"&lon1="+userMarker.getLatLng().lng+"&lat2="+point.lat()+"&lon2="+point.lng();
    url = url+"&trans=FOOT";

    $.getJSON(url, function(json){
        display(json);
   });
}

function codeAddress(address, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK){
                callback.call(window, results[0].geometry.location);
        }
        else{
             alert("Adresse incorrecte");
        }
    });
}
