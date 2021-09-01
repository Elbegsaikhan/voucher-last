import {
    getGroups,
    modalGroup,
    changeHandlerGroup,
    saveGroup,
    getGroupItem,
    closeModalGroup,
    deleteGroup,
} from '../actionTypes';
let defaultItem = {
    _id: 0,
    title: '',
    order: ''
};
const initialState = {
    categories: [],
    names: [],
    item: {...defaultItem},
    cateModal: false,
    all: 0,
    confirmCateLoading: false,
    itemLoading: false
};
export default function locations(state = initialState, action) {
    switch (action.type) {
        case getGroups.REQUEST:
            return {
                ...state,
                cateLoading: true
            };
        case getGroups.RESPONSE:
            return {
                ...state,
                cateLoading: false,
                categories: (action.json || {}).categories || state.categories,
                names: (action.json || {}).names || state.names
            };
        case modalGroup.RESPONSE:
            return{
                ...state,
                item: {...defaultItem},
                cateModal: action.value,
                itemLoading: false
            };
        case changeHandlerGroup.RESPONSE:
            return {
                ...state,
                item: {
                    ...state.item,
                    [action.data.name]: action.data.value
                }
            };
        case saveGroup.REQUEST:
            return {
                ...state,
                confirmCateLoading: true
            };
        case saveGroup.RESPONSE:
            if(action.json.success) {
                let categories = state.categories;
                if(action.json.edit) {
                    categories = state.categories.map((item)=>{
                        if(item._id !== action.json.result._id) {
                            return item;
                        } else {
                            return action.json.result;
                        }
                    });
                } else {
                    categories = [
                        action.json.result,
                        ...state.categories
                    ]
                }
                return{
                    ...state,
                    cateModal: false,
                    item: {...defaultItem},
                    categories,
                    confirmCateLoading: false
                };
            } else {
                return{
                    ...state,
                    confirmCateLoading: false
                };
            }
        case getGroupItem.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case getGroupItem.RESPONSE:
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
        case closeModalGroup.RESPONSE:
            return{
                ...state,
                cateModal: false,
                item: {...defaultItem},
                itemLoading: false
            }; 
        case deleteGroup.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case deleteGroup.RESPONSE:
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