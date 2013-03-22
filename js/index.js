/**
 * Created with IntelliJ IDEA.
 * User: Pouille
 * Date: 21/03/13
 * Time: 17:12
 * To change this template use File | Settings | File Templates.
 */
var map;
var carMarker;
var valueOfSwitch;

var myIcon = L.icon({
    iconUrl: 'image/position-marker.png',
    iconRetinaUrl: 'image/position-marker.png',
    iconSize: [15, 15]
});

var userMarker = new L.marker([0,0], {icon : myIcon});

function successCallback(position){
    console.log("Latitude : " + position.coords.latitude + ", longitude : " + position.coords.longitude);
    userMarker.setLatLng(new L.LatLng(position.coords.latitude, position.coords.longitude));
}

function centerMap() {
    map.setView(userMarker.getLatLng(), 15);
}

var watchID = navigator.geolocation.watchPosition(successCallback, errorCallback, {frequency:3000, enableHighAccuracy:true});

function initialize() {

    map = new L.Map('map_canvas');

    L.tileLayer('http://{s}.tile.cloudmade.com/0c3c0bc80ad3493c83cc4982d49871d7/54566/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(map);

    map.setView(new L.LatLng(47.3, 2.47),8);

    userMarker.addTo(map);
}

$('#carte').live('pageshow',function(event, ui){
    initialize();
    submitform();
});

function togglePOI2() {
    $("#poi2").toggle("fast", "linear", function (data) {});
}

function addAdr2(balise) {
    if (balise=="Maison"){
        $("#adr2").val("26, rue pierre louvrier, clamart");
    }
    else if (balise=="ECP"){
        $("#adr2").val("2, avenue sully prud'homme, sceaux");
    }
    else if (balise=="Travail"){
        $("#adr2").val("10, Rue Houdan, chatenay-Malabry");
    }
}

function getLastTimestamp(datetimestamp, pointArray, index) {
    if(datetimestamp>pointArray[index].timeFromStart){
        return getLastTimestamp(datetimestamp, pointArray, index+1);
    }
    else {
        if (index>=pointArray.length){
            return pointArray[0];
        }
        else {
            return pointArray[index];
        }
    }
}

function go() {
    var k=0;
    array=go.pointList;
    if (go.count < go.pointList.length) {
        // logs 1, 2, 3 to firebug console at 1 second intervals
        k=0;

        var lastPoint = getLastTimestamp(Date.now(), go.pointList, k);
        carMarker.setLatLng(new L.LatLng(lastPoint.lat, lastPoint.lon));

        console.log(Date.now() + "||" +  lastPoint.timeFromStart );

        console.log(lastPoint);
        window.setTimeout(go, 1000);
    }
}

var array;

function postCovoitOffer(){
    var Json = JSON.parse(sessionStorage.getItem("lastPath"));

    if (Json.steps[0].transport.name=="Car") {
        var JsonToSend = {} ;
        JsonToSend.travelInfo="information sur le trajet";

        var myCarIcon = L.icon({
            iconUrl: 'image/car.png',
            iconRetinaUrl: 'image/car.png',
            iconSize: [33, 40],
            iconAnchor: [33, 40]
        });

        var arrayOfPoint = [];

        var arrayOfVertex = Json.steps[0].points;

        for( var k=0;k<arrayOfVertex.length;k++) {
            vertex=arrayOfVertex[k];
            var point={};

            point.id=vertex.id;
            point.time=vertex.timeFromStart;

            arrayOfPoint.push(point);
        }

        JsonToSend.points = arrayOfPoint;

        $.mobile.showPageLoadingMsg("a" ,"Envoi du trajet au serveur...");

        $.post("http://127.0.0.1:8080/smartmobility/rest/carpoule", {json: JSON.stringify(JsonToSend) },
            function(data){
                $.mobile.hidePageLoadingMsg("a" ,"Envoi du trajet dans le cloud...");
            }, "json");
    }
}