import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getGroups() {
    let url = `/dashboard/api/groups`;
    return networkActions.requestGet(constants.getGroups,url);
}
export function modalGroup(id){
    if(id === 0) {
        return {
            type: constants.modalGroup.RESPONSE,
            value: true
        }
    } else {
        let url = `/dashboard/api/get/group/${id}`;
        return networkActions.requestGet(constants.getGroupItem,url);
    }
}
export function changeHandler(data) {
    return {
        type: constants.changeHandlerGroup.RESPONSE,
        data
    }
}
export function saveGroup(data) {
    let url = `/dashboard/api/group/action`;
    return networkActions.requestPost(constants.saveGroup,url,data);
}
export function closeModalGroup(){
    return {
        type: constants.closeModalGroup.RESPONSE
    }
}
export function deleteGroup(id) {
    let url = `/dashboard/api/delete/group/${id}`;
    return networkActions.requestGet(constants.deleteGroup,url);
}