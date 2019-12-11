import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { setCurrentUser } from './actions/authenticationAction';
import configureStore from './store/configureStore';
import App from './components/App';
import setAuthorizationToken from './utils/setAuthorizationToken';
import './styles/index.scss';
import { retrieveUserFromToken } from './utils';

const store = configureStore();

const persistor = persistStore(store);

if (localStorage.jwtToken) {
    setAuthorizationToken(localStorage.jwtToken);
    retrieveUserFromToken(localStorage.jwtToken).then(decodedUser => {
        store.dispatch(setCurrentUser(decodedUser));
    });
}

render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.getElementById('app')
);
