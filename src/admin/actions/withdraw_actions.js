import * as constants from '../actionTypes'
import * as networkActions from './networkActions'

export function saveWithdraw(data){
    let url = '/checkout/save/withdraw'
    return networkActions.requestPost(constants.saveWithdraw, url, data)
}

export function getWithdraw(current){
    let url = `/checkout/withdraw/${current}`
    return networkActions.requestGet(constants.getWithdraw, url)
}

export function getWithdrawChangeStatus(data) {
    let url = `/checkout/withdrawChangeStats`;
    return networkActions.requestGet(constants.getChangeStatus,url, data);
}

