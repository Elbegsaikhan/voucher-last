import * as actionTypes from '../actionTypes'

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
    all: 0
}
export default function withdraw(state = iniState, action){
    switch (action.type){
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
                    items: action.json.item,
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
        case actionTypes.saveWithdraw.REQUEST:
            return {
                ...state
            }
        case actionTypes.saveWithdraw.RESPONSE:
            if(action.json.success) {
                console.log("Action json", action.json)
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
                    item: {...defaultDraw},
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

