import {
    getLocations,
    modalLocation,
    changeHandlerLocation,
    saveLocation,
    getLocationItem,
    closeModalLocation,
    deleteLocation,
} from '../actionTypes';
let defaultItem = {
    _id: 0,
    title: '',
    parent: '',
    order: ''
};
const initialState = {
    categories: [],
    parentLocations: [],
    item: {...defaultItem},
    cateModal: false,
    all: 0,
    confirmCateLoading: false,
    itemLoading: false
};
export default function locations(state = initialState, action) {
    switch (action.type) {
        case getLocations.REQUEST:
            return {
                ...state,
                cateLoading: true
            };
        case getLocations.RESPONSE:
            return {
                ...state,
                cateLoading: false,
                categories: (action.json || {}).categories || state.categories,
                parentLocations: (action.json || {}).parentLocations || state.parentLocations,
            };
        case modalLocation.RESPONSE:
            return{
                ...state,
                item: {...defaultItem},
                cateModal: action.value,
                itemLoading: false
            };
        case changeHandlerLocation.RESPONSE:
            return {
                ...state,
                item: {
                    ...state.item,
                    [action.data.name]: action.data.value
                }
            };
        case saveLocation.REQUEST:
            return {
                ...state,
                confirmCateLoading: true
            };
        case saveLocation.RESPONSE:
            if(action.json.success) {
                return{
                    ...state,
                    cateModal: false,
                    item: {...defaultItem},
                    categories: (action.json || {}).categories || state.categories,
                    parentLocations: (action.json || {}).parentLocations || state.parentLocations,
                    confirmCateLoading: false
                };
            } else {
                return{
                    ...state,
                    confirmCateLoading: false
                };
            }
        case getLocationItem.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case getLocationItem.RESPONSE:
            if(action.json.success) {
                return{
                    ...state,
                    cateModal: true,
                    item: {
                        ...action.json.result
                    },
                    itemLoading: false
                };
            } else {
                return{
                    ...state,
                    cateModal: false,
                    item: {...defaultItem},
                    itemLoading: false
                };
            }
        case closeModalLocation.RESPONSE:
            return{
                ...state,
                cateModal: false,
                item: {...defaultItem},
                itemLoading: false
            }; 
        case deleteLocation.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case deleteLocation.RESPONSE:
            if(action.json.success) {
                let categories = state.categories.filter((item)=>{
                    return item._id !== action.json.id;
                });
                return{
                    ...state,
                    categories,
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