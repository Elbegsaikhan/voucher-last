import * as networkActions from './networkActions';
import * as constants from '../actionTypes';

export function getList(data) {
    let url = `/api/list`;
    return networkActions.requestGet(constants.getList, url, data);
}


export function allList() {
    let url = `/api/all/list`;
    return networkActions.requestGet(constants.allList, url);
}
