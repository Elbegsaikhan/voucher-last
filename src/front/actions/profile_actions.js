import * as networkActions from './networkActions';
import * as constants from '../actionTypes';

export function getRequests() {
    let url = `/api/getRequests`;
    return networkActions.requestGet(constants.getRequests,url);
}
export function setUser(data) {
    return {
        type: constants.setUser.RESPONSE,
        json: data
    }
}
