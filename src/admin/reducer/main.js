import * as actionTypes from '../actionTypes';
import config from '../config';
const initialState = {
    user:null,
};
export default function main(state = initialState, action) {
    switch (action.type) {
        case actionTypes.login.REQUEST:
            return {
                ...state,
            };
        case actionTypes.login.RESPONSE:
            return{
                ...state,
                user:action.json.user,
            };
        default:
            return state;
    }
}