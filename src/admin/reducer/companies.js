import {
    changeHandlerCompany,
    closeModalCompany,
    getCompanies,
    saveCompany,
    modalCompany,
    deleteCompany,
    getItemCompany
} from '../actionTypes';
import config from '../config';
let defaultItem = {
    _id: 0,
    name: '',
    bio: '',
    image: '',
    newImage: false,
    logo: '',
    slug: '',
    newLogo: false,
    email: '',
    phone: '',
    account: '',
    bankName: '',
    accountName: '',
    facebook: '',
    instagram: '',
    youtube: '',
    location: '',
    category: '',
    subCategory: '',
    status: '',
    membership: '',
    position: {
        lat: 47.919103,
        lng: 106.917534
    }
};
const initialState = {
    categories: [],
    locations: [],
    items: [],
    item: {...defaultItem},
    itemModal: false,
    itemsLoading: true,
    all: 0,
    confirmLoading: false,
    itemLoading: false
};
export default function insight(state = initialState, action) {
    switch (action.type) {
        case changeHandlerCompany.RESPONSE:
            return {
                ...state,
                item: {
                    ...state.item,
                    [action.data.name]: action.data.value
                }
            };
        case closeModalCompany.RESPONSE:
            return{
                ...state,
                cateModal: false,
                itemModal: false,
                item: {...defaultItem},
                itemLoading: false
            };
        case getCompanies.REQUEST:
            return {
                ...state,
                itemsLoading: true
            };
        case getCompanies.RESPONSE:
            return {
                ...state,
                itemsLoading: false,
                items: (action.json || {}).items || state.items,
                all: (action.json || {}).all || 0,
                categories: (action.json || {}).categories || [],
                locations: (action.json || {}).locations || []
            };
        case saveCompany.REQUEST:
            return {
                ...state,
                confirmLoading: true
            };
        case saveCompany.RESPONSE:
            if(action.json.success) {
                let items = state.items;
                if(action.json.edit) {
                    items = state.items.map((item)=>{
                        if(item._id !== action.json.result._id) {
                            return item;
                        } else {
                            return action.json.result;
                        }
                    });
                } else {
                    items = [
                        ...state.items,
                        action.json.result
                    ]
                }
                return{
                    ...state,
                    itemModal: false,
                    item: {...defaultItem},
                    items,
                    confirmLoading: false
                };
            } else {
                return{
                    ...state,
                    confirmLoading: false
                };
            }
        case modalCompany.RESPONSE:
            return{
                ...state,
                item: {...defaultItem},
                itemModal: action.value,
                itemLoading: false
            };
        case getItemCompany.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case getItemCompany.RESPONSE:
            if(action.json.success) {

                let cate = null;
                if(action.json.result.category && state.categories.some(aa => aa._id == action.json.result.category && aa.parent)) {
                    cate = state.categories.find(aa => aa._id == action.json.result.category)
                }
                console.log(cate)
                return{
                    ...state,
                    itemModal: true,
                    item: {
                        ...action.json.result,
                        category: cate ? cate.parent : action.json.result.category || '',
                        subCategory: cate ? cate._id : '',

                    },
                    itemLoading: false
                };
            } else {
                return{
                    ...state,
                    itemModal: false,
                    item: {...defaultItem},
                    itemLoading: false
                };
            }
        case deleteCompany.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case deleteCompany.RESPONSE:
            if(action.json.success) {
                let items = state.items.filter((item)=>{
                    return item._id !== action.json.id;
                });
                return{
                    ...state,
                    items,
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