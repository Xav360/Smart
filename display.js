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
        iconUrl: 'A-position.png',
        iconRetinaUrl: 'A-position.png',
        iconSize: [33, 40],
        iconAnchor: [16, 40]
    });

    var myIconB = L.icon({
        iconUrl: 'B-position.png',
        iconRetinaUrl: 'B-position.png',
        iconSize: [33, 40],
        iconAnchor: [16, 40]
    });



    var edges = [];
    var pointList = json.steps ;

    if (!edgePath==null) {
        edgePath.setMap(null);
        AMarker=null;
        BMarker=null;
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
    var URL="";
    codeAddress(URL, $("#adr1").val(), 1, addToUrl);
}

function addToUrl(index, point) {
    var url="http://"+document.getElementById("ip").value+":8080/rest/routing?&lat"+index+"="+point.lat()+"&lon"+index+"="+point.lng();
    return url;
}

function redirect(url, index, point){
    url = url + "&lat"+index+"="+point.lat()+"&lon"+index+"="+point.lng();

    var radios = $('input[name="trans"]');
    var selectedValue="CAR";

    for(var i = 0; i < radios.length; i++) {
        if(radios[i].checked) selectedValue = radios[i].value;
    }

    url = url + "&trans=" + selectedValue;

    $.getJSON(url, function(json){
        display(json);
    });
}

function codeAddress(URL, address, index, callback) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK){
            if(index==1) {
                var url=callback.call(window, index, results[0].geometry.location);
                codeAddress(url,$("#adr2").val(),2,redirect);
            }
            else {
                callback.call(window, URL, index, results[0].geometry.location);
            }
        }
        else{

        }
    });
}
