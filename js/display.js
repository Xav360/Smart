/**
 * @author Hugues Pouillot
 */

var map;
var edgePath;

function display(json) {
    $.mobile.hidePageLoadingMsg("a" ,"Itinéraire en cours de calcul...");
    if (json.statut="ok") {

        var min = Math.floor(json.travelInfo.time/60000);
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

        if (!edgePath==null) {
            edgePath.setMap(null);
        }

        var BMarker = new L.marker([json.travelInfo.from.lat,json.travelInfo.from.lon], {icon : myIconB});
        BMarker.addTo(map);

        var AMarker = new L.marker([json.travelInfo.to.lat,json.travelInfo.to.lon], {icon : myIconA});
        AMarker.addTo(map);

        var color="#000000";

        for(var k=0; k<json.steps.length;k++) {
            var edges = [];

            if(json.steps[k].transport.name=="Car") {
                color="#FF0000";
            }
            else if (json.steps[k].transport.name=="Carpool"){
                color ="#00E1FF";
            }
            else if (json.steps[k].transport.name=="Foot"){
                color ="#00C427";
            }

            var pointList = json.steps[k].points ;
            for (var i =0; i<pointList.length-1; i++){
                edges.push(new L.LatLng(pointList[i].lat,pointList[i].lon));
            }

            var myStyle = {
                "color": color,
                "weight": 7,
                "opacity": 0.70,
                "smoothFactor":0.1
            };

            L.polyline(edges, myStyle).addTo(map);
        }

        map.fitBounds([
            [pointList[0].lat, pointList[0].lon],
            [pointList[pointList.length-1].lat, pointList[pointList.length-1].lon]
        ]);
    }
    else {
        alert("Le chemin n'a pas été trouvé");
    }
}

function submitform()
{//this check triggers the validations
    codeAddress($("#adr2").val(), getPath);
}

function getPath(point){
    //176.31.126.197
   var url="http://127.0.0.1:8080/smartmobility/rest/routing?lat1="+userMarker.getLatLng().lat+"&lon1="+userMarker.getLatLng().lng+"&lat2="+point.lat()+"&lon2="+point.lng();
    var trans;
    if ($('a[aria-valuetext]').attr("aria-valuetext")=="Car") {
       trans = "CAR";
    }
    else {
        trans="FOOT";
    }

    url = url+"&trans="+trans+"&timestamp="+Date.now();

    centerMap();

    $.mobile.showPageLoadingMsg("a" ,"Itinéraire en cours de calcul...");

    $.getJSON(url, function(json){
        display(json);
        sessionStorage.setItem("lastPath",JSON.stringify(json));
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
