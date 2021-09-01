import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getCate() {
    let url = `/dashboard/api/categories`;
    return networkActions.requestGet(constants.getCategories,url);
}
export function modalCate(id){
    if(id === 0) {
        return {
            type: constants.modalCate.RESPONSE,
            value: true
        }
    } else {
        let url = `/dashboard/api/get/category/${id}`;
        return networkActions.requestGet(constants.getCateItem,url);
    }
}
export function changeHandler(data) {
    return {
        type: constants.changeHandlerCate.RESPONSE,
        data
    }
}
export function saveCate(data) {
    let url = `/dashboard/api/categories/action`;
    return networkActions.requestPost(constants.saveCate,url,data);
}
export function closeModalCate(){
    return {
        type: constants.closeModalCate.RESPONSE
    }
}
export function deleteCate(id) {
    let url = `/dashboard/api/delete/category/${id}`;
    return networkActions.requestGet(constants.deleteCate,url);
}