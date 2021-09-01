import * as constants from "../actionTypes";
import * as networkActions from './networkActions';


export function changeHandler(data) {
    return {
        type: constants.changeHandlerTution.RESPONSE,
        data
    }
}
export function removeImage(ind) {
    return {
        type: constants.removeImage.RESPONSE,
        data: {index: ind}
    }
}
export function addImage() {
    return {
        type: constants.addImage.RESPONSE
    }
}
export function modalTution(id){
    if(id === 0) {
        return {
            type: constants.modalTution.RESPONSE,
            value: true
        }
    } else {
        let url = `/dashboard/api/get/tution/${id}`;
        return networkActions.requestGet(constants.getItemTution,url);
    }
}
export function closeModalTution(){
    return {
        type: constants.closeModalTution.RESPONSE
    }
}
export function getTutions(current) {
    let url = `/dashboard/api/tutions/${current}`;
    return networkActions.requestGet(constants.getTutions,url);
}
export function saveTution(data) {
    let url = `/dashboard/api/tution/action`;
    return networkActions.requestPost(constants.saveTution,url, data);
}
export function deleteTution(id) {
    let url = `/dashboard/api/delete/tution/${id}`;
    return networkActions.requestGet(constants.deleteTution,url);
}