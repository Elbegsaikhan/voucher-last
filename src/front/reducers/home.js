import * as actionTypes from "../actionTypes";
import config from "../config";

const initialState = {
    sliders: [],
    cates: [],
    locations: [],
    loading: true,
    companyPlatinum: [],
    companyGold: [],
    company: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.getHome.REQUEST:
            return {
                ...state,
                loading: true,
            };
        case actionTypes.getHome.RESPONSE:
            return {
                ...state,
                loading: false,
                sliders: action.json.sliders || [],
                cates: action.json.cates || [],
                locations: action.json.locations || [],
                companyPlatinum: action.json.companyPlatinum || [],
                companyGold: action.json.companyGold || [],
                company: action.json.company || [],
            };
        default:
            return state;
    }
};
