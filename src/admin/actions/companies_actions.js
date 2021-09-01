import * as constants from "../actionTypes";
import * as networkActions from './networkActions';


export function changeHandler(data) {
    return {
        type: constants.changeHandlerCompany.RESPONSE,
        data
    }
}
export function modalCompany(id){
    if(id === 0) {
        return {
            type: constants.modalCompany.RESPONSE,
            value: true
        }
    } else {
        let url = `/dashboard/api/get/company/${id}`;
        return networkActions.requestGet(constants.getItemCompany,url);
    }
}
export function closeModalCompany(){
    return {
        type: constants.closeModalCompany.RESPONSE
    }
}
export function getCompanies(current) {
    let url = `/dashboard/api/companies/${current}`;
    return networkActions.requestGet(constants.getCompanies,url);
}
export function saveCompany(data) {
    let url = `/dashboard/api/company/action`;
    return networkActions.requestPost(constants.saveCompany,url, data);
}
export function deleteCompany(id) {
    let url = `/dashboard/api/delete/company/${id}`;
    return networkActions.requestGet(constants.deleteCompany,url);
}