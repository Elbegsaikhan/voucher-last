import { getProduct} from "../actionTypes";
import * as actionTypes from "../actionTypes";
let defaultProduct = {
    _id: 0,
    name: "",
    image: "",
    desc: "",
    price: "",
    address: '',
    status: 'active',
    date: "",
    category: '',
    torol: 'null',
    companyId: '',
    companyName: '',
    phone: '',
}
const initialState = {
    items: [],
    item: {...defaultProduct},
    itemLoading: false,
    confirmLoading: false,
    loading: true,
    all: 0
};


export default function product(state = initialState, action) {
    switch (action.type) {
        case actionTypes.getProduct.REQUEST:
            return {
                ...state,
                loading: true
            };
        case actionTypes.getProduct.RESPONSE:
            if(action.json.success) {
                return{
                    ...state,
                    items:action.json.result,
                    all: action.json.all,
                    loading: false
                };
            } else {
                return{
                    ...state,
                    items: [],
                    all: 0,
                    loading: false
                };
            }
        case actionTypes.modalProduct.RESPONSE:
            return{
                ...state,
                item: {...defaultProduct},
                modal: action.value,
                itemLoading: false
            };
        case actionTypes.changeHandlerProduct.RESPONSE:
            console.log("name", action.data.name, 'value', action.data.value)
            return {
                ...state,
                item: {
                    ...state.item,
                    [action.data.name]: action.data.value
                }
            };
        case actionTypes.getProductItem.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case actionTypes.getProductItem.RESPONSE:
            if(action.json.success) {
                return{
                    ...state,
                    modal: true,
                    item: {
                        newImage: false,
                        ...action.json.result
                    },
                    itemLoading: false
                };
            } else {
                return{
                    ...state,
                    modal: false,
                    item: {...defaultProduct},
                    itemLoading: false
                };
            }
        case actionTypes.saveProduct.REQUEST:
            return {
                ...state,
                confirmLoading: true
            };
        case actionTypes.saveProduct.RESPONSE:
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
                    modal: false,
                    item: {...defaultProduct},
                    items: items,
                    confirmLoading: false
                };
            } else {
                return{
                    ...state,
                    confirmLoading: false
                };
            }
        case actionTypes.deleteProduct.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case actionTypes.deleteProduct.RESPONSE:
            if(action.json.success) {
                let items = state.items.filter((item)=>{
                    return item._id !== action.json.id;
                });
                return{
                    ...state,
                    items: items,
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
