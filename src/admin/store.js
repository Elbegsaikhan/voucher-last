import { applyMiddleware, compose, createStore } from "redux";
import promiseMiddleware from "./promiseMiddleware";

import thunk from "redux-thunk";
import rootReducer from "./reducer/index";

const finalCreateStore = compose(applyMiddleware(thunk, promiseMiddleware))(
    createStore
);

export default function configureStore(initialState) {
    return finalCreateStore(rootReducer, initialState);
}
