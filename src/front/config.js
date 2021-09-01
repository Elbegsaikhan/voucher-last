import {EventEmitter} from 'fbemitter';
let config = exports;

let configList = {
    webUrl:'localhost',
    emitter:new EventEmitter()
};
config.config = function (data) {
    configList = {
        ...configList,
        ...data
    }
};
config.get = function (option) {
    return configList[option];
};
export default config