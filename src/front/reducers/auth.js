import * as actionTypes from '../actionTypes';
import config from "../config";
const initialState = {
    login: {
        email: '',
        password: '',
        link: '',
    },
    register: {
        email: '',
        password: '',
        passwordRepeat: '',
        image: '',
        first_name: '',
        last_name: '',
        name: '',
        bio: '',
        phone: '',
        facebook: '',
        location: '',
        category: '',
        categorySub: '',
        instagram: '',
        youtube: ''
    },
    email: '',
    isRegister: false,
    isCompany: false,
    cates: [],
    location: [],
    modal: false,
    registerLoading: false,
    showCode: false,
    loginLoading: false,
    imageLoading: false,
};

export default(state = initialState, action) => {
    switch (action.type) {
        case actionTypes.openLogin.RESPONSE:
            return {
                ...state,
                modal :true
            };
        case actionTypes.closeLogin.RESPONSE:
            return {
                ...initialState

            };
        case actionTypes.changeValueLogin.RESPONSE:
            return {
                ...state,
                [action.json.stt]: {
                    ...state[action.json.stt],
                    ...action.json.data
                }

            };
        case actionTypes.uploadImage.REQUEST:
            return {
                ...state,
                register: {
                    ...state.register,
                    image: action.data.fake_image
                },
                imageLoading:true,
            };
        case actionTypes.uploadImage.RESPONSE:
            if(action.json.success){
                return {
                    ...state,
                    register: {
                        ...state.register,
                        image: action.json.image
                    },
                    imageLoading:false,
                };
            }else {
                return {
                    ...state,
                    register: {
                        ...state.register,
                        image: ''
                    },
                    imageLoading:false,
                };
            }
        case actionTypes.switchType.RESPONSE:
            return {
                ...initialState,
                isRegister: action.json.type === 'register',
                modal: true,

            };
        case actionTypes.chagneType.RESPONSE:
            return {
                ...state,
                isCompany: action.json.type,
                register: {
                    email: '',
                    password: '',
                    passwordRepeat: '',
                    image: '',
                    first_name: '',
                    last_name: '',
                    name: '',
                    bio: '',
                    phone: '',
                    facebook: '',
                    instagram: '',
                    youtube: ''
                },

            };
        case actionTypes.submitLogin.REQUEST:
            return {
                ...state,
                loginLoading: true

            };
        case actionTypes.submitLogin.RESPONSE:
            if(action.json.pending) {
                return {
                    ...state,
                    loginLoading: false,
                    showCode: true,
                    email: action.json.email,
                    modal: !action.json.success
                };
            } else if(action.json.success) {
                console.log("action", action.json)
                if(action.json.link){
                    window.location.assign(`/checkout/${action.json.link}`);
                }else {
                    window.location.assign('/')
                }
                return {
                    ...state,
                    loginLoading: false,
                    modal: false
                };
            } else {
                return {
                    ...state,
                    loginLoading: false
                };
            }
        case actionTypes.submitRegister.REQUEST:
            return {
                ...state,
                registerLoading: true
            };
        case actionTypes.submitRegister.RESPONSE:
            if(action.json.success) {
                window.location.assign("/");
                return {
                    ...state,
                };
            } else {
                return {
                    ...state,
                    registerLoading: false
                };
            }
        case actionTypes.getCatesReg.REQUEST:
            return {
                ...state
            };
        case actionTypes.getCatesReg.RESPONSE:
            return {
                ...state,
                cates: action.json.cates || [],
                location: action.json.location || [],
            };
        default:
            return state;
    }
};
