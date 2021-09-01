import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getLocations() {
    let url = `/dashboard/api/locations`;
    return networkActions.requestGet(constants.getLocations,url);
}
export function modalLocation(id){
    if(id === 0) {
        return {
            type: constants.modalLocation.RESPONSE,
            value: true
        }
    } else {
        let url = `/dashboard/api/get/location/${id}`;
        return networkActions.requestGet(constants.getLocationItem,url);
    }
}
export function changeHandler(data) {
    return {
        type: constants.changeHandlerLocation.RESPONSE,
        data
    }
}
export function saveLocation(data) {
    let url = `/dashboard/api/locations/action`;
    return networkActions.requestPost(constants.saveLocation,url,data);
}
export function closeModalLocation(){
    return {
        type: constants.closeModalLocation.RESPONSE
    }
}
export function deleteLocation(id) {
    let url = `/dashboard/api/delete/location/${id}`;
    return networkActions.requestGet(constants.deleteLocation,url);
}