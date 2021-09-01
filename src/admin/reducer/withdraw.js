import * as actionTypes from '../actionTypes.js'
import config from "../config";

const defaultDraw = {
    _id: 0,
    amount: 0,
    sku: '',
    status: '',
    delivery: '',
    userID: '',
    productID: '',
    companyID: ''
}
const iniState = {
    items: [],
    item: {...defaultDraw},
    all: 0,
    loading: true,
}
export default function withdraw(state = iniState, action){
    switch (action.type) {
        case actionTypes.getWithdraw.REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionTypes.getWithdraw.RESPONSE:
            console.log('action json', action.json)
            if(action.json.success){
                return {
                    ...state,
                    items: action.json.items,
                    all: action.json.all,
                    loading: false
                }
            }else {
                return {
                    ...state,
                    items: [],
                    all: 0,
                    loading: false
                }
            }
        case actionTypes.getWithdrawChangeStatus.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case actionTypes.getWithdrawChangeStatus.RESPONSE:
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
        default :
            return {
                 ...state,
                loading: false
            }
    }
}
