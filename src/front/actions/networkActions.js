import fetch from "fetch-everywhere";
import querystring from "querystring";
import config from "../config";
import Cookies from "js-cookie";
import axios from "axios";

export function requestGet(
    requestActions,
    url,
    requestParams = null,
    header = {}
) {
    return (dispatch) => {
        dispatch(requestStart(requestParams, requestActions));
        header = {
            ...header,
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        let currentUrl = url;
        if (requestParams) {
            currentUrl += "?" + querystring.stringify(requestParams);
        }
        return fetch(currentUrl, {
            method: "get",
            headers: header,
            credentials: "same-origin",
        })
            .then(function (response) {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 400) {
                    return {
                        success: false,
                        status: response.status,
                        message: "Хандах эрхгүй байна",
                    };
                } else if (response.status === 404) {
                    config.get("emitter").emit("404");
                    return {
                        success: false,
                        status: response.status,
                        message: "Таны хайсан зүйл олдсонгүй",
                    };
                } else if (response.status === 500) {
                    return {
                        success: false,
                        status: response.status,
                        message: "Системд алдаа гарлаа",
                    };
                } else {
                    return {
                        success: false,
                        status: response.status,
                        message: response.message,
                    };
                }
            })
            .then((json) => {
                // console.log(json)
                if (!json.success && json.status !== 404) {
                    config.get("emitter").emit("error", json.message);
                }
                if (json.status === 400) {
                    config.get("emitter").emit("auth-error", json.message);
                }
                if (json.sucmod) {
                    config.get("emitter").emit("success", json.message);
                }
                dispatch(requestEnd(json, requestActions));
            })
            .catch((error) => {
                dispatch(
                    requestEnd(
                        {
                            success: false,
                            error: "aldaa",
                            data: requestParams,
                        },
                        requestActions
                    )
                );
            });
    };
}
function requestStart(json, requestActions) {
    return {
        type: requestActions.REQUEST,
        json,
    };
}
function requestEnd(json, requestActions) {
    return {
        type: requestActions.RESPONSE,
        json,
    };
}

export function requestPost(
    requestActions,
    url,
    data,
    requestParams = null,
    header = {}
) {
    return (dispatch) => {
        dispatch(requestStart(data, requestActions));
        header = {
            ...header,
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        let currentUrl = url;
        if (requestParams) {
            currentUrl += "?" + querystring.stringify(requestParams);
        }
        return fetch(currentUrl, {
            method: "post",
            credentials: "same-origin",
            headers: header,
            body: JSON.stringify(data),
        })
            .then(function (response) {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 400) {
                    return {
                        success: false,
                        status: response.status,
                        message: "Хандах эрхгүй байна",
                    };
                } else if (response.status === 404) {
                    config.get("emitter").emit("404");
                    return {
                        success: false,
                        status: response.status,
                        message: "Таны хайсан зүйл олдсонгүй",
                    };
                } else if (response.status === 500) {
                    return {
                        success: false,
                        status: response.status,
                        message: "Системд алдаа гарлаа",
                    };
                } else {
                    return {
                        success: false,
                        status: response.status,
                        message: response.message,
                    };
                }
            })
            .then((json) => {
                if (!json.success && json.status !== 404) {
                    config.get("emitter").emit("error", json.message);
                }
                if (json.sucmod) {
                    config.get("emitter").emit("success", json.message);
                }
                dispatch(requestEnd(json, requestActions));
            })
            .catch((error) => {
                dispatch(
                    requestEnd(
                        { success: false, error: error, data: data },
                        requestActions
                    )
                );
            });
    };
}

export function uploadProgress(
    requestActions,
    data,
    type,
    neededData = {},
    requestParams = null,
    header = null
) {
    let url = `/api/${type}/upload`;
    let fd = new FormData();
    let id = Date.now();
    fd.append("image", data[0]);
    if (type == "image") {
        neededData.fake_image = window.URL.createObjectURL(data[0]);
    }
    return (dispatch) => {
        dispatch(
            requestMediaUploadStart(
                { id: id },
                requestActions,
                type,
                neededData
            )
        );
        if (Cookies.get("token") != null) {
            header = {
                ...header,
                token: Cookies.get("token"),
            };
        }
        let currentUrl = `${url}`;
        axios
            .post(currentUrl, fd, {
                onUploadProgress: (progressEvent) => {
                    let percent;
                    percent = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    dispatch(
                        requestMediaProgress(
                            { percent: percent },
                            requestActions,
                            type,
                            neededData
                        )
                    );
                },
                method: "post",
                headers: {
                    ...header,
                    Accept: "application/json",
                },
                responseType: "json",
            })
            .then(function (response) {
                if (response.status == 200) {
                    return response.data;
                } else {
                    if (response.status == 401) {
                        if (config.get("emitter"))
                            config.get("emitter").emit("auth-error");
                    }
                    return {
                        success: false,
                        id: id,
                        status: response.status,
                    };
                }
            })
            .then((json) => {
                if (!json.success) {
                    config.get("emitter").emit("error", json.message);
                }
                if (json.sucmod) {
                    config.get("emitter").emit("success", json.message);
                }
                dispatch(
                    requestMediaUploadEnd(
                        json,
                        requestActions,
                        type,
                        neededData
                    )
                );
            })
            .catch((error) => {
                dispatch(
                    requestMediaUploadEnd(
                        { success: false },
                        requestActions,
                        type,
                        neededData
                    )
                );
            });
    };
}
export function requestMediaUploadStart(json, requestParams, type, data) {
    return {
        type: requestParams.REQUEST,
        json,
        data,
    };
}
export function requestMediaProgress(json, requestParams, type, data) {
    return {
        type: requestParams.PROGRESS,
        json,
        data,
    };
}
export function requestMediaUploadEnd(json, requestParams, type, data) {
    return {
        type: requestParams.RESPONSE,
        json,
        data,
    };
}
