import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import main from "./main";
import home from "./home";
import auth from "./auth";
import product from "./product";
import profile from './profile'
import cart from './cart'
import cates from './cates'
import withdraw from './withdraw'
import coupon from './coupon'


export default combineReducers({
    toastr: toastrReducer,
    home: home,
    main: main,
    auth: auth,
    product: product,
    profile: profile,
    cart: cart,
    cates: cates,
    withdraw: withdraw,
    coupon: coupon

});
