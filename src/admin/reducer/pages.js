import {
    changeHandlerPage,
    closeModalPage,
    getPages,
    savePage,
    modalPage,
    deletePage,
    getItemPage
} from '../actionTypes';
import config from '../config';
let defaultItem = {
    _id: 0,
    title: '',
    slug: '',
    body: '',
    image: '',
    newImage: false,
};
const initialState = {
    categories: [],
    pages: [],
    item: {...defaultItem},
    newsModal: false,
    pagesLoading: true,
    all: 0,
    confirmLoading: false,
    itemLoading: false
};
export default function insight(state = initialState, action) {
    switch (action.type) {
        case changeHandlerPage.RESPONSE:
            return {
                ...state,
                item: {
                    ...state.item,
                    [action.data.name]: action.data.value
                }
            };
        case closeModalPage.RESPONSE:
            return{
                ...state,
                cateModal: false,
                newsModal: false,
                item: {...defaultItem},
                itemLoading: false
            };
        case getPages.REQUEST:
            return {
                ...state,
                pagesLoading: true
            };
        case getPages.RESPONSE:
            return {
                ...state,
                pagesLoading: false,
                pages: (action.json || {}).news || state.pages,
                all: (action.json || {}).all || 0
            };
        case savePage.REQUEST:
            return {
                ...state,
                confirmLoading: true
            };
        case savePage.RESPONSE:
            if(action.json.success) {
                config.get('emitter').emit('editorPage');
                let pages = state.pages;
                if(action.json.edit) {
                    pages = state.pages.map((item)=>{
                        if(item._id !== action.json.result._id) {
                            return item;
                        } else {
                            return action.json.result;
                        }
                    });
                } else {
                    pages = [
                        ...state.pages,
                        action.json.result
                    ]
                }
                return{
                    ...state,
                    newsModal: false,
                    item: {...defaultItem},
                    pages,
                    confirmLoading: false
                };
            } else {
                return{
                    ...state,
                    confirmLoading: false
                };
            }
        case modalPage.RESPONSE:
            return{
                ...state,
                item: {...defaultItem},
                newsModal: action.value,
                itemLoading: false
            };
        case getItemPage.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case getItemPage.RESPONSE:
            if(action.json.success) {
                return{
                    ...state,
                    newsModal: true,
                    item: {
                        ...action.json.result
                    },
                    itemLoading: false
                };
            } else {
                return{
                    ...state,
                    newsModal: false,
                    item: {...defaultItem},
                    itemLoading: false
                };
            }
        case deletePage.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case deletePage.RESPONSE:
            if(action.json.success) {
                let pages = state.pages.filter((item)=>{
                    return item._id !== action.json.id;
                });
                return{
                    ...state,
                    pages,
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