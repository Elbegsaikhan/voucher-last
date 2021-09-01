import * as actionTypes from '../actionTypes';
let defaultAbout = {
    _id: 0,
    title: '',
    description: '',
    logo: '',
    logo2: '',
    background: '',
    homeImage: '',
    homeBanner1: '',
    homeBanner2: '',
    phone: '',
    email: '',
    address: '',
    footerText: '',
    facebook: '',
    instagram: '',
    youtube: '',
    dans: '',
    dansNer: '',
    amount: '',
};
const initialState = {
    about: {...defaultAbout},
    confirmLoading: false,
    aboutLoading: true
};
export default function client(state = initialState, action) {
    switch (action.type) {
        case actionTypes.getAbout.REQUEST:
            return {
                ...state,
                aboutLoading: true
            };
        case actionTypes.getAbout.RESPONSE:
            if(action.json.success) {
                let about = action.json.result || {};
                return{
                    ...state,
                    about: about
                };
            } else {
                return{
                    ...state,
                    aboutLoading: false
                };
            }
        case actionTypes.saveAbout.REQUEST:
            return {
                ...state,
                confirmLoading: true
            };
        case actionTypes.saveAbout.RESPONSE:
            if(action.json.success) {
                let about = action.json.result || {};
                return{
                    ...state,
                    about: about,
                    confirmLoading: false
                };
            } else {
                return{
                    ...state,
                    confirmLoading: false
                };
            }
        case actionTypes.changeHandlerAbout.RESPONSE:
            return {
                ...state,
                about: {
                    ...state.about,
                    [action.data.name]: action.data.value
                }
            };
        default:
            return state;
    }
}