/**
 * Created by battumur on 11/4/2016.
 */
import fetch from 'fetch-everywhere';
import querystring from 'querystring';
import config from '../config';
export function requestGet(requestActions,url, requestParams = null,header={}) {

    return dispatch => {
        dispatch(requestStart(requestParams,requestActions));
        header = {
            ...header,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        let currentUrl = url;
        if(requestParams){
            currentUrl +='?'+querystring.stringify(requestParams)
        }
        return fetch(currentUrl, {
            method: 'get',
            headers: header,
            credentials: 'same-origin'
        })
            .then(function (response) {
                if (response.status === 200) {
                    return response.json();
                } else if(response.status === 400){
                    return {
                        success:false,
                        status:response.status,
                        message:'Хандах эрхгүй байна'
                    }
                }else if(response.status === 500){
                    return {
                        success:false,
                        status:response.status,
                        message:'Системд алдаа гарлаа'
                    }
                }else {
                    return {
                        success:false,
                        status:response.status,
                        message:response.message
                    }

                }
            })
            .then(json => {
                if(!json.success){
                    config.get('emitter').emit('error',json.message);
                }
                if(json.sucmod) {
                    config.get('emitter').emit('success',json.message);
                }
                dispatch(requestEnd(json,requestActions))
            })
            .catch(error => {
                console.log(error);
                dispatch(requestEnd({success:false,error:error,data:requestParams},requestActions))
            });

    }

}
function requestStart(json,requestActions) {
    return {
        type: requestActions.REQUEST,
        json
    }
}
function requestEnd(json,requestActions) {
    return {
        type: requestActions.RESPONSE,
        json
    }
}

export function requestPost(requestActions,url,data,requestParams = null,header={}) {
    return dispatch => {
        dispatch(requestStart(data,requestActions));
        header = {
            ...header,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        let currentUrl = url;
        if(requestParams){
            currentUrl +='?'+querystring.stringify(requestParams)
        }
        return fetch(currentUrl, {
            method: 'post',
            credentials: 'same-origin',
            headers: header,
            body: JSON.stringify(data)
        })
            .then(function (response) {
                if (response.status === 200) {
                    return response.json();
                }else if(response.status === 400){
                    return {
                        success:false,
                        status:response.status,
                        message:'Хандах эрхгүй байна'
                    }
                }else if(response.status === 500){
                    return {
                        success:false,
                        status:response.status,
                        message:'Системд алдаа гарлаа'
                    }
                }else{
                    return {
                        success:false,
                        status:response.status,
                        message:response.message
                    }
                }
            })
            .then(json => {
                if(!json.success){
                    config.get('emitter').emit('error',json.message);
                }
                if(json.sucmod) {
                    config.get('emitter').emit('success',json.message);
                }
                dispatch(requestEnd(json,requestActions));
            })
            .catch(error => {

                dispatch(requestEnd({success:false,error:error,data:data},requestActions));

            });

    }

}
