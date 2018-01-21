import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { setCurrentUser } from './actions/authenticationAction';
import configureStore from './store/configureStore';
import App from './components/App';
import setAuthorizationToken from './utils/setAuthorizationToken';
import '../node_modules/materialize-css/dist/js/materialize.min';
import '../node_modules/materialize-css/dist/css/materialize.min.css';
import '../node_modules/material-icons/css/material-icons.css';
import './styles/styles.css';

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
