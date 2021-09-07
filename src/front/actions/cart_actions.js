import * as networkActions from './networkActions'
import * as constants from "../actionTypes"

export function getCart() {
    let url = 'api/cart'
    return networkActions.requestGet(constants.getCart, url)
}
export function saveCart(data){
    let url = '/api/save/cart'
    console.log("Product action line 11", data)
    return networkActions.requestPost(constants.saveCart, url, data)
}
