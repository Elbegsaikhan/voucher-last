import * as constants from "../actionTypes";
import * as networkActions from './networkActions';


export function getProduct(current) {
    let url = `/dashboard/api/product/${current}`
    return networkActions.requestGet(constants.getProduct, url)
}
export function saveProduct(data){
    let url = '/dashboard/api/save/product'
    return networkActions.requestPost(constants.saveProduct, url, data)
}
export function deleteProduct(id){
    let url = `/dashboard/api/delete/product/${id}`
    return networkActions.requestGet(constants.deleteProduct, url)
}

export function modalProduct(id){
    if(id === 0){
        return {
            type: constants.modalProduct.RESPONSE,
            value: true
        }
    }else {
        let url = `/dashboard/api/get/product/${id}`;
        return networkActions.requestGet(constants.getProductItem, url, );
    }
}
export function closeModalProduct(){
    return {
        type: constants.modalProduct.RESPONSE,
        value: false
    }
}
export function changeHandler(data){
    console.log("Change Handler", data)
    return {
        type: constants.changeHandlerProduct.RESPONSE,
        data
    }
}

// export function getProduct() {
//     let url = `/dashboard/api/product`
//     return networkActions.requestGet(constants.getProduct, url)
// }
