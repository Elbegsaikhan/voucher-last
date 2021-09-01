import * as actionTypes from '../actionTypes';
let defaultItem = {
	_id: 0,
	code: 0
};
const initialState = {
	items: [],
	item: {...defaultItem},
	itemLoading: false,
	confirmLoading: false,
	loading: false,
	all: 0,
	success: false
};
export default (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.deleteCoupon.REQUEST:
			return {
				...state,
				itemLoading: true
			};
		case actionTypes.deleteCoupon.RESPONSE:
			if(action.json.success) {
				let s = action.json.success
				return{
					...state,
					success: 'true',
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
