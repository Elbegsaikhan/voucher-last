import * as actionTypes from '../actionTypes';
let defaultItem = {
	_id: 0,
	code: 0,
	user: ''
};
const initialState = {
	items: [],
	item: {...defaultItem},
	itemLoading: false,
	confirmLoading: false,
	loading: false,
	all: 0
};
export default function coupon(state = initialState, action) {
	switch (action.type) {
		case actionTypes.getCoupon.REQUEST:
			return {
				...state,
				loading: true
			};
		case actionTypes.getCoupon.RESPONSE:
			console.log("RES", action)
			if(action.json.success) {
				return{
					...state,
					items:action.json.result,
					all: action.json.all,
					loading: false
				};
			} else {
				return{
					...state,
					items: [],
					all: 0,
					loading: false
				};
			}
		case actionTypes.modalCoupon.RESPONSE:
			console.log("Modal cupon response ", action)
			return{
				...state,
				item: {...defaultItem},
				modal: action.value,
				itemLoading: false
			};
		case actionTypes.changeHandlerCoupon.RESPONSE:
			return {
				...state,
				item: {
					...state.item,
					[action.data.name]: action.data.value
				}
			};
		case actionTypes.getCouponItem.REQUEST:
			return {
				...state,
				itemLoading: true
			};
		case actionTypes.getCouponItem.RESPONSE:
			if(action.json.success) {
				return{
					...state,
					modal: true,
					item: {
						newImage: false,
						...action.json.result
					},
					itemLoading: false
				};
			} else {
				return{
					...state,
					modal: false,
					item: {...defaultItem},
					itemLoading: false
				};
			}
		case actionTypes.saveCoupon.REQUEST:
			return {
				...state,
				confirmLoading: true
			};
		case actionTypes.saveCoupon.RESPONSE:
			if(action.json.success) {
				let items = state.items;
				if(action.json.edit) {
					items = state.items.map((item)=>{
						if(item._id !== action.json.result._id) {
							return item;
						} else {
							return action.json.result;
						}
					});
				} else {
					items = [
						...state.items,
						action.json.result
					]
				}
				return{
					...state,
					modal: false,
					item: {...defaultItem},
					items: items,
					confirmLoading: false
				};
			} else {
				return{
					...state,
					confirmLoading: false
				};
			}
		case actionTypes.deleteCoupon.REQUEST:
			return {
				...state,
				itemLoading: true
			};
		case actionTypes.deleteCoupon.RESPONSE:
			if(action.json.success) {
				let items = state.items.filter((item)=>{
					return item._id !== action.json.id;
				});
				return{
					...state,
					items: items,
					itemLoading: false
				};
			} else {
				return{
					...state,
					itemLoading: false
				};
			}
		default:
			return state;
	}
}
