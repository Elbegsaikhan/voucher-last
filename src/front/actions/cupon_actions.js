import * as constants from "../actionTypes"
import * as networkActions from "./networkActions"

export function deleteCoupon(code) {
	let url = `/api/delete/coupon/${code}`
	return networkActions.requestGet(constants.deleteCoupon, url)
}
