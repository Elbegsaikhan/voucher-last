import * as networkActions from "./networkActions";
import * as constants from "../actionTypes";

export function getHome() {
    let url = `/api/home`;
    return networkActions.requestGet(constants.getHome, url);
}
