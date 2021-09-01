import {
    getCategories,
    modalCate,
    changeHandlerCate,
    saveCate,
    getCateItem,
    closeModalCate,
    deleteCate,
} from '../actionTypes';
let defaultItem = {
    _id: 0,
    title: '',
    parent: '',
    order: ''
};
const initialState = {
    categories: [],
    parentCates: [],
    item: {...defaultItem},
    cateModal: false,
    all: 0,
    confirmCateLoading: false,
    itemLoading: false
};
export default function cates(state = initialState, action) {
    switch (action.type) {
        case getCategories.REQUEST:
            return {
                ...state,
                cateLoading: true
            };
        case getCategories.RESPONSE:
            return {
                ...state,
                cateLoading: false,
                categories: (action.json || {}).categories || state.categories,
                parentCates: (action.json || {}).parentCates || state.parentCates
            };
        case modalCate.RESPONSE:
            return{
                ...state,
                item: {...defaultItem},
                cateModal: action.value,
                itemLoading: false
            };
        case changeHandlerCate.RESPONSE:
            return {
                ...state,
                item: {
                    ...state.item,
                    [action.data.name]: action.data.value
                }
            };
        case saveCate.REQUEST:
            return {
                ...state,
                confirmCateLoading: true
            };
        case saveCate.RESPONSE:
            if(action.json.success) {
                return{
                    ...state,
                    cateModal: false,
                    item: {...defaultItem},
                    categories: (action.json || {}).categories || state.categories,
                    parentCates: (action.json || {}).parentCates || state.parentCates,
                    confirmCateLoading: false
                };
            } else {
                return{
                    ...state,
                    confirmCateLoading: false
                };
            }
        case getCateItem.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case getCateItem.RESPONSE:
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
        case closeModalCate.RESPONSE:
            return{
                ...state,
                cateModal: false,
                item: {...defaultItem},
                itemLoading: false
            }; 
        case deleteCate.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case deleteCate.RESPONSE:
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