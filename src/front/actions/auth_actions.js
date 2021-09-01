import * as networkActions from './networkActions';
import * as constants from '../actionTypes';

export function openLogin() {
    return {
        type: constants.openLogin.RESPONSE
    }
}
export function closeLogin() {
    return {
        type: constants.closeLogin.RESPONSE
    }
}
export function changeValue(data, stt) {
    return {
        type: constants.changeValueLogin.RESPONSE,
        json: {data, stt}
    }
}
export function switchType(type) {
    return {
        type: constants.switchType.RESPONSE,
        json: {type}
    }
}
export function chagneType(type) {
    return {
        type: constants.chagneType.RESPONSE,
        json: {type}
    }
}
export function submitLogin(data) {
    let url = `/api/login`;
    console.log("Data submit login", data)
    return networkActions.requestPost(constants.submitLogin,url,data);
}
export function getCates(data) {
    let url = `/api/get_cates`;
    return networkActions.requestGet(constants.getCatesReg,url,data);
}
export function submitRegister(data) {
    let url = `/api/register`;
    if(data.isCompany) {
        url = `/api/registerCompany`;
    }
    return networkActions.requestPost(constants.submitRegister,url,data);
}
export function uploadImage(files){
    return networkActions.uploadProgress(constants.uploadImage , files, 'image');
}
