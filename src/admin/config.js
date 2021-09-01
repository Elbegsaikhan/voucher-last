import {EventEmitter} from 'fbemitter';
let adminConfig = exports;

let configList = {
    title:'Progrid Systems',
    emitter:new EventEmitter()
};
adminConfig.config = function (data) {
    configList = {
        ...configList,
        ...data
    }
};
adminConfig.get = function (option) {
    return configList[option];
};

export default adminConfig