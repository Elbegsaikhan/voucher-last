import * as constants from "../actionTypes";
import * as networkActions from './networkActions';


export function changeHandler(data) {
    return {
        type: constants.changeHandlerNews.RESPONSE,
        data
    }
}
export function modalNews(id){
    if(id === 0) {
        return {
            type: constants.modalNews.RESPONSE,
            value: true
        }
    } else {
        let url = `/dashboard/api/get/News/${id}`;
        return networkActions.requestGet(constants.getItemNews,url);
    }
}
export function closeModalNews(){
    return {
        type: constants.closeModalNews.RESPONSE
    }
}
export function getNewss(current) {
    let url = `/dashboard/api/Newss/${current}`;
    return networkActions.requestGet(constants.getNewss,url);
}
export function saveNews(data) {
    let url = `/dashboard/api/News/action`;
    return networkActions.requestPost(constants.saveNews,url, data);
}
export function deleteNews(id) {
    let url = `/dashboard/api/delete/News/${id}`;
    return networkActions.requestGet(constants.deleteNews,url);
}