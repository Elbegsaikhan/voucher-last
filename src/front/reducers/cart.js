import { getCart } from "../actionTypes";
import * as actionTypes from "../actionTypes"

const defaultCart = {
    _id: 0,
    companyId: '',
    productId: '',
    status: '',
    payment: ''
}
const iniState = {
    items: [],
    item: {...defaultCart},
    all: 0
}

export default function cart(state = iniState, action){
    switch (action.type){
        case actionTypes.getCart.REQUEST:
            return {
                ...state
            }
        case actionTypes.getCart.RESPONSE:
            if(action.json.success){
                return {
                    ...state,
                    items: action.json.result,
                    all: action.json.all
                }
            }else {
                return {
                    ...state,
                    items: [],
                    all: 0
                }
            }
        case actionTypes.saveCart.REQUEST:

            return {
                ...state
            }
        case actionTypes.saveCart.RESPONSE:

            if(action.json.success) {
                let items = state.items
                if(action.json.edit) {
                    items = state.items.map((item) => {
                        if(item._id !== action.json.result._id){
                            return item
                        }else {
                            return action.json.result
                        }
                    })
                }else {
                    items = [
                        ...state.items,
                        action.json.result
                    ]
                }
                return {
                    ...state,
                    item: {...defaultCart},
                    items: items,
                }
            }else {
                return {
                    ...state,
                }
            }
        default:
            return {
                ...state
            }

    }
}
