import {
    changeHandlerTution,
    closeModalTution,
    getTutions,
    saveTution,
    modalTution,
    deleteTution,
    getItemTution,
    removeImage,
    addImage
} from '../actionTypes';
import config from '../config';
import moment from 'moment';
let defaultItem = {
    _id: 0,
    title: '',
    description: '',
    group: '',
    sale: 0,
    price: 0,
    order: 0,
    color: '#FDF8BC',
    saleDate: moment(),
    images:[''],
};
const initialState = {
    items: [],
    groups: [],
    item: {...defaultItem},
    modal: false,
    loading: true,
    all: 0,
    confirmLoading: false,
    itemLoading: false
};
export default function insight(state = initialState, action) {
    switch (action.type) {
        case changeHandlerTution.RESPONSE:
            if(action.data.name === 'image') {
                return {
                    ...state,
                    item: {
                        ...state.item,
                        images: state.item.images.map((item , i) => {
                            if(action.data.index == i) {
                                return action.data.value
                            } else {
                                return item
                            }
                        })
                    }
                };
            } else {
                return {
                    ...state,
                    item: {
                        ...state.item,
                        [action.data.name]: action.data.value
                    }
                };
            }
        case addImage.RESPONSE:
            return {
                ...state,
                item: {
                    ...state.item,
                    images: [
                        ...state.item.images,
                        ''
                    ]
                }
            };
        case removeImage.RESPONSE:
            let images = state.item.images.filter(function (item, ind) {
                return ind != action.data.index
            })
            return {
                ...state,
                item: {
                    ...state.item,
                    images: images
                }
            };
        case closeModalTution.RESPONSE:
            return{
                ...state,
                modal: false,
                item: {...defaultItem},
                itemLoading: false
            };
        case getTutions.REQUEST:
            return {
                ...state,
                loading: true
            };
        case getTutions.RESPONSE:
            return {
                ...state,
                loading: false,
                items: (action.json || {}).items || state.items,
                groups: (action.json || {}).groups || state.groups,
                all: (action.json || {}).all || 0
            };
        case saveTution.REQUEST:
            return {
                ...state,
                confirmLoading: true
            };
        case saveTution.RESPONSE:
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
                    items,
                    confirmLoading: false
                };
            } else {
                return{
                    ...state,
                    confirmLoading: false
                };
            }
        case modalTution.RESPONSE:
            return{
                ...state,
                item: {...defaultItem},
                modal: action.value,
                itemLoading: false
            };
        case getItemTution.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case getItemTution.RESPONSE:
            if(action.json.success) {
                return{
                    ...state,
                    modal: true,
                    item: {
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
        case deleteTution.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case deleteTution.RESPONSE:
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