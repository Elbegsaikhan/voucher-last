import * as constants from "../actionTypes";
import * as networkActions from './networkActions';



export function getRequests(current) {
    let url = `/dashboard/api/requests/${current}`;
    return networkActions.requestGet(constants.getRequests,url);
}
export function getChangeStatus(data) {
    let url = `/dashboard/api/requestsChangeStats`;
    return networkActions.requestGet(constants.getChangeStatus,url, data);
}