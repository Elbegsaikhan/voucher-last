import * as networkActions from './networkActions'
import * as constants from "../actionTypes"

export function getCart() {
    let url = 'api/cart'
    return networkActions.requestGet(constants.getCart, url)
}
export function saveCart(data){
    let url = '/api/save/cart'
    // console.log("Product action line 11", constants.saveCart)
    return networkActions.requestPost(constants.saveCart, url, data)
}
export function deleteCart(id){

    let url = `/api/delete/cart/${id}`
    return networkActions.requestGet(constants.deleteCartOne, url)
}
