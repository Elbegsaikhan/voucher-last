import React from 'react';
import Router from './router';
import { Provider } from 'react-redux';
import { CartProvider } from 'react-use-cart';

import configureStore from './store';
import ReactDOM from "react-dom";
/** @namespace window.__INITIAL_STATE__ */
let main = window.__INITIAL_STATE__;
const store = configureStore(main);
ReactDOM.render(
    <Provider store={store}>
        <CartProvider>
            <Router />
        </CartProvider>
    </Provider>,
    document.querySelector('#wrap')
);
