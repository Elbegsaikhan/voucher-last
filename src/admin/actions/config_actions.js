import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getAbout() {
    let url = `/dashboard/api/get/config`;
    return networkActions.requestGet(constants.getAbout,url);
}
export function saveAbout(data) {
    let url = `/dashboard/api/save/about`;
    return networkActions.requestPost(constants.saveAbout,url,data);
}
export function changeHandler(data) {
    return {
        type: constants.changeHandlerAbout.RESPONSE,
        data
    }
}