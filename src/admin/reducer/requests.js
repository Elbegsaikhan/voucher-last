import {
    getRequests,
    getChangeStatus
} from '../actionTypes';
import config from '../config';
const initialState = {
    items: [],
    itemsLoading: true,
    all: 0,
    itemLoading: false,
};
export default function insight(state = initialState, action) {
    switch (action.type) {
        case getRequests.REQUEST:
            return {
                ...state,
                itemsLoading: true
            };
        case getRequests.RESPONSE:
            return {
                ...state,
                itemsLoading: false,
                items: (action.json || {}).items || state.items,
                all: (action.json || {}).all || 0,
            };
        case getChangeStatus.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case getChangeStatus.RESPONSE:
            if(action.json.success) {
                config.get('emitter').emit('success', 'Амжилттай хадгалагдлаа');
                return {
                    ...state,
                    itemLoading: false,
                    items: state.items.map(function (item) {
                        if(item._id == action.json.item._id) {
                            return action.json.item
                        } else {
                            return item
                        }
                    }),
                };
            } else {
                return {
                    ...state,
                    itemLoading: false,
                };
            }
        default:
            return state;
    }
}