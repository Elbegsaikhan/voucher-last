import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getSlider(current) {
    let url = `/dashboard/api/sliders/${current}`;
    return networkActions.requestGet(constants.getSlider,url);
}
export function saveSlider(data) {
    let url = `/dashboard/api/save/slider`;
    return networkActions.requestPost(constants.saveSlider,url,data);
}
export function deleteSlider(id) {
    let url = `/dashboard/api/delete/slider/${id}`;
    return networkActions.requestGet(constants.deleteSlider,url);
}
export function modalSlider(id) {
    if(id === 0) {
        return {
            type: constants.modalSlider.RESPONSE,
            value: true
        }
    } else {
        let url = `/dashboard/api/get/slider/${id}`;
        return networkActions.requestGet(constants.getSliderItem,url,);
    }
}
export function closeModalSlider() {
    return {
        type: constants.modalSlider.RESPONSE,
        value: false
    }
}
export function changeHandler(data) {
    return {
        type: constants.changeHandlerSlider.RESPONSE,
        data
    }
}