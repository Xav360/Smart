/**
 * @author Hugues Pouillot
 */

var map;
var edgePath;

function display(json) {

    var myStyle = {
        "color": "#ff7800",
        "weight": 5,
        "opacity": 0.65
    };

    var edges = [];
    var pointList = json.steps ;

    if (!edgePath==null) {
        edgePath.setMap(null);
    }

    for (var i =0; i<pointList.length-1; i++){
        edges.push(new L.LatLng(pointList[i].lat,pointList[i].lon));
    }

    map.fitBounds([
        [pointList[0].lat, pointList[0].lon],
        [pointList[pointList.length-1].lat, pointList[pointList.length-1].lon]
    ]);

    L.polyline(edges, {color: 'red'}).addTo(map);
}

function submitform()
{//this check triggers the validations
    var URL="";
    codeAddress(URL, $("#adr1").val(), 1, addToUrl);
}

function addToUrl(index, point) {
    var url="http://"+document.getElementById("ip").value+":8080/smartmobility/rest/routing?&lat"+index+"="+point.lat()+"&lon"+index+"="+point.lng();
    return url;
}

function redirect(url, index, point){
    url = url + "&lat"+index+"="+point.lat()+"&lon"+index+"="+point.lng();
    /*
     var radios = trajet.transportation;
     var selectedValue="CAR";

     for(var i = 0; i < radios.length; i++) {
     if(radios[i].checked) selectedValue = radios[i].value;
     }
     */
    var selectedValue="FOOT";
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
/**
 * Created with IntelliJ IDEA.
 * User: Pouille
 * Date: 11/03/13
 * Time: 14:45
 * To change this template use File | Settings | File Templates.
 */
