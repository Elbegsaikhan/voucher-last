import * as actionTypes from "../actionTypes";
import config from "../config";

const iniState = {
    user: null,
    config: {},
};

export default (state = iniState, action) => {
    // console.log("Main action", action.json);
    switch (action.type) {
        case actionTypes.submitLogin.RESPONSE:
            return {
                ...state,
                user: action.json.user,
            };
        case actionTypes.setUser.RESPONSE:
            return {
                ...state,
                user: action.json,
            };
        default:
            return state;
    }
};
