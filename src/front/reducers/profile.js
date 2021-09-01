import { getRequests } from "../actionTypes";
const initialState = {
    loading: true,
    items: []

};

export default(state = initialState, action) => {
    switch (action.type) {
        case getRequests.REQUEST:
            return {
                ...state,loading:true
            };
        case getRequests.RESPONSE:
            return {
                ...state,
                loading:false,
                items: action.json.items || []
            };
        default:
            return state;
    }
};
