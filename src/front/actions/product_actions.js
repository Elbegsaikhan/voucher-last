import * as networkActions from "./networkActions";
import * as constants from "../actionTypes";

export function getProduct() {
    // debugger;
    let url = "/api/product";
    return networkActions.requestGet(constants.getProduct, url);
}
export function searchProduct(title) {
    let url = `/api/search/${title}`
    return networkActions.requestGet(constants.searchProduct, url, data)
}
