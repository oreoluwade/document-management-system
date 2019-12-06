/* eslint-disable import/no-extraneous-dependencies */
import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import jwt from 'jsonwebtoken';
import { setCurrentUser } from './actions/authenticationAction';
import configureStore from './store/configureStore';
import App from './components/App';
import setAuthorizationToken from './utils/setAuthorizationToken';
import './styles/index.scss';

const store = configureStore();

const retrieveUserFromToken = token => {
    return jwt.verify(token, process.env.SECRET, async (err, decoded) => {
        if (err) {
            return err;
        } else {
            if (decoded) {
                const { username, id, roleId } = decoded;
                return { username, id, roleId };
            }
        }
    });
};

if (localStorage.jwtToken) {
    setAuthorizationToken(localStorage.jwtToken);
    retrieveUserFromToken(localStorage.jwtToken).then(user => {
        store.dispatch(setCurrentUser(user));
    });
}

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app')
);
