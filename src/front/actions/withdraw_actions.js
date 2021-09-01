import * as networkActions from './networkActions'
import * as constants from "../actionTypes";

export function saveWithdraw(data){
    let url = '/checkout/save/withdraw'
    return networkActions.requestPost(constants.saveWithdraw, url, data)
}

export function getWithdraw(current){
    let url = `/checkout/withdrawUser/${current}`
    return networkActions.requestGet(constants.getWithdraw, url)
}
