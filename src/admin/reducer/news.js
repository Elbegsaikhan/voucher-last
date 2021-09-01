import {
    changeHandlerNews,
    closeModalNews,
    getNewss,
    saveNews,
    modalNews,
    deleteNews,
    getItemNews
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
    news: [],
    item: {...defaultItem},
    newsModal: false,
    newsLoading: true,
    all: 0,
    confirmLoading: false,
    itemLoading: false
};
export default function insight(state = initialState, action) {
    switch (action.type) {
        case changeHandlerNews.RESPONSE:
            return {
                ...state,
                item: {
                    ...state.item,
                    [action.data.name]: action.data.value
                }
            };
        case closeModalNews.RESPONSE:
            return{
                ...state,
                cateModal: false,
                newsModal: false,
                item: {...defaultItem},
                itemLoading: false
            };
        case getNewss.REQUEST:
            return {
                ...state,
                newsLoading: true
            };
        case getNewss.RESPONSE:
            return {
                ...state,
                newsLoading: false,
                news: (action.json || {}).news || state.news,
                all: (action.json || {}).all || 0
            };
        case saveNews.REQUEST:
            return {
                ...state,
                confirmLoading: true
            };
        case saveNews.RESPONSE:
            if(action.json.success) {
                config.get('emitter').emit('editorNews');
                let news = state.news;
                if(action.json.edit) {
                    news = state.news.map((item)=>{
                        if(item._id !== action.json.result._id) {
                            return item;
                        } else {
                            return action.json.result;
                        }
                    });
                } else {
                    news = [
                        ...state.news,
                        action.json.result
                    ]
                }
                return{
                    ...state,
                    newsModal: false,
                    item: {...defaultItem},
                    news,
                    confirmLoading: false
                };
            } else {
                return{
                    ...state,
                    confirmLoading: false
                };
            }
        case modalNews.RESPONSE:
            return{
                ...state,
                item: {...defaultItem},
                newsModal: action.value,
                itemLoading: false
            };
        case getItemNews.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case getItemNews.RESPONSE:
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
        case deleteNews.REQUEST:
            return {
                ...state,
                itemLoading: true
            };
        case deleteNews.RESPONSE:
            if(action.json.success) {
                let news = state.news.filter((item)=>{
                    return item._id !== action.json.id;
                });
                return{
                    ...state,
                    news,
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