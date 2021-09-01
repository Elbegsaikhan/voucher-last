import * as constants from "../actionTypes"
import * as networkActions from "./networkActions"

export function getCoupon(current) {
    let url = `/dashboard/api/coupon/${current}`
    console.log('URL', url)
    return networkActions.requestGet(constants.getCoupon, url)
}
export function saveCoupon(data) {
    let url = `/dashboard/api/save/coupon`;
    return networkActions.requestPost(constants.saveCoupon,url,data);
}
export function deleteCoupon(id) {
    let url = `/dashboard/api/delete/coupon/${id}`;
    return networkActions.requestGet(constants.deleteSlider,url);
}
export function modalCoupon(id) {
    console.log("iD2", id)
    if(id === 0) {
        console.log("iD3", id)
        return {
            type: constants.modalCoupon.RESPONSE,
            value: true
        }
    } else {
        let url = `/dashboard/api/get/coupon/${id}`;
        return networkActions.requestGet(constants.getSliderItem,url,);
    }
}
export function closeModalCoupon() {
    return {
        type: constants.modalCoupon.RESPONSE,
        value: false
    }
}
export function changeHandler(data) {
    return {
        type: constants.changeHandlerCoupon.RESPONSE,
        data
    }
}
