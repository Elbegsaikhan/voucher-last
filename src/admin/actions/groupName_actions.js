import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getGroupNames(current) {
    let url = `/dashboard/api/groupNames/${current}`;
    return networkActions.requestGet(constants.getGroupName,url);
}
export function saveGroupName(data) {
    let url = `/dashboard/api/save/groupName`;
    return networkActions.requestPost(constants.saveGroupName,url,data);
}
export function deleteGroupName(id) {
    let url = `/dashboard/api/delete/groupName/${id}`;
    return networkActions.requestGet(constants.deleteGroupName,url);
}
export function modalGroupName(id) {
    if(id === 0) {
        return {
            type: constants.modalGroupName.RESPONSE,
            value: true
        }
    } else {
        let url = `/dashboard/api/get/groupName/${id}`;
        return networkActions.requestGet(constants.getGroupNameItem,url,);
    }
}
export function closeModalGroupName() {
    return {
        type: constants.modalGroupName.RESPONSE,
        value: false
    }
}
export function changeHandler(data) {
    return {
        type: constants.changeHandlerGroupName.RESPONSE,
        data
    }
}