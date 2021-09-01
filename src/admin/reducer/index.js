import {combineReducers} from 'redux';
import main from './main';
import home from './home';
import slider from './slider';
import config from './config';
import cates from './cates';
import locations from './locations';
import pages from './pages';
import companies from './companies';
import tutions from './tutions';
import groups from './groups';
import news from './news';
import groupName from './groupName';
import requests from './requests';
import product from './product'
import withdraw from './withdraw'
import coupon from './coupon'

const rootReducer = combineReducers({
    main,
    home,
    slider,
    config,
    locations,
    cates,
    companies,
    pages,
    tutions,
    requests,
    groupName,
    groups,
    news,
    product,
    withdraw,
    coupon
});
export default rootReducer;
