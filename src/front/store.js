import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import promiseMiddleware from "./promiseMiddleware";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const finalCreateStore = composeEnhancers(
    applyMiddleware(thunk, promiseMiddleware)
)(createStore);

export default function configureStore(initialState) {
    return finalCreateStore(rootReducer, initialState);
}
