import * as actionTypes from '../actionTypes';
let defaultItem = {
    _id: 0,
    title: '',
    description: '',
    order: 0,
    position: 1,
    newImage: false,
    image: '',
    link: '',
};
const initialState = {
    items: [],
    item: {...defaultItem},
    itemLoading: false,
    confirmLoading: false,
    loading: true,
    all: 0
};
export default function slider(state = initialState, action) {
    switch (action.type) {
        case actionTypes.getSlider.REQUEST:
            return {
                ...state,
                loading: true
            };
        case actionTypes.getSlider.RESPONSE:
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
        case actionTypes.modalSlider.RESPONSE:
            return{
                ...state,
                item: {...defaultItem},
                modal: action.value,
                itemLoading: false
            };
        case actionTypes.changeHandlerSlider.RESPONSE:
            return {
                ...state,
                item: {
                    ...state.item,
                    [action.data.name]: action.data.value
                }
            };
        case actionTypes.getSliderItem.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case actionTypes.getSliderItem.RESPONSE:
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
                    item: {...defaultItem},
                    itemLoading: false
                };
            }
        case actionTypes.saveSlider.REQUEST:
            return {
                ...state,
                confirmLoading: true
            };
        case actionTypes.saveSlider.RESPONSE:
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
                    item: {...defaultItem},
                    items: items,
                    confirmLoading: false
                };
            } else {
                return{
                    ...state,
                    confirmLoading: false
                };
            }
        case actionTypes.deleteSlider.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case actionTypes.deleteSlider.RESPONSE:
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