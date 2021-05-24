import React from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "react-app-polyfill/stable";
import "react-app-polyfill/ie11"; // For IE 11 support
import { Provider } from "react-redux";

import Store from "./store";
import * as serviceWorker from './service-worker';
import "./polyfill";
import App from './app';

import "./index.css";



const root=(
    <Provider store={Store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
)
ReactDOM.render(root, document.getElementById('root'));

serviceWorker.unregister();
