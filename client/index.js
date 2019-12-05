/* eslint-disable import/no-extraneous-dependencies */
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { setCurrentUser } from './actions/authenticationAction';
import configureStore from './store/configureStore';
import App from './components/App';
import setAuthorizationToken from './utils/setAuthorizationToken';
import './styles/index.scss';

const store = configureStore();

if (localStorage.jwtToken) {
    setAuthorizationToken(localStorage.jwtToken);
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
}

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
