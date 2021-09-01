import * as actionTypes from "../actionTypes";
import config from "../config";
const initialState = {
    cates: [],
    // locations: [],
    // items: [],
    loading: true,
};

export default (state = initialState, action) => {
    // console.log("action type", action.type)
    switch (action.type) {
        case actionTypes.getList.REQUEST:
            return {
                ...state,
                loading: true,
            };
        case actionTypes.getList.RESPONSE:
            return {
                ...state,
                loading: false,
                items: action.json.items || [],
                cates: action.json.cates || [],
                locations: action.json.locations || [],
            };
        case actionTypes.allList.REQUEST:
            // console.log("All list req")
            return {
                ...state,
                loading: true,
            };
        case actionTypes.allList.RESPONSE:
            // console.log("Reducers", action.json)
            return {
                ...state,
                loading: false,
                cates: action.json.category
            };
        default:
            return state;
    }
};
