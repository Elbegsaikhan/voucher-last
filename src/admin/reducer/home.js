import * as actionTypes from '../actionTypes';
const initialState = {

};
export default function home(state = initialState, action) {
    switch (action.type) {
        case actionTypes.home.REQUEST:
            return {
                ...state
            };
        case actionTypes.home.RESPONSE:
            return {
                ...state
            };
        default:
            return state;
    }
}