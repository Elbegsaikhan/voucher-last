import * as constants from "../actionTypes";
import * as networkActions from './networkActions';


export function changeHandler(data) {
    return {
        type: constants.changeHandlerPage.RESPONSE,
        data
    }
}
export function modalPage(id){
    if(id === 0) {
        return {
            type: constants.modalPage.RESPONSE,
            value: true
        }
    } else {
        let url = `/dashboard/api/get/page/${id}`;
        return networkActions.requestGet(constants.getItemPage,url);
    }
}
export function closeModalPage(){
    return {
        type: constants.closeModalPage.RESPONSE
    }
}
export function getPages(current) {
    let url = `/dashboard/api/pages/${current}`;
    return networkActions.requestGet(constants.getPages,url);
}
export function savePage(data) {
    let url = `/dashboard/api/page/action`;
    return networkActions.requestPost(constants.savePage,url, data);
}
export function deletePage(id) {
    let url = `/dashboard/api/delete/page/${id}`;
    return networkActions.requestGet(constants.deletePage,url);
}