import React from 'react';
import Router from './router';
import { Provider } from 'react-redux';

import configureStore from './store';
import ReactDOM from "react-dom";
/** @namespace window.__INITIAL_STATE__ */
let main = window.__INITIAL_STATE__;
 const store = configureStore(main);
ReactDOM.render(
    <Provider store={store}>
        <Router/>
    </Provider>,
    document.querySelector('#wrap')
);
