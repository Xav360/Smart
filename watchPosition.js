/**
 * Created with IntelliJ IDEA.
 * User: Pouille
 * Date: 12/03/13
 * Time: 21:53
 * To change this template use File | Settings | File Templates.
 */

function errorCallback(error){
    switch(error.code){
        case error.PERMISSION_DENIED:
            alert("L'utilisateur n'a pas autorisé l'accès à sa position");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("L'emplacement de l'utilisateur n'a pas pu être déterminé");
            break;
        case error.TIMEOUT:
            alert("Le service n'a pas répondu à temps");
            break;
    }
}