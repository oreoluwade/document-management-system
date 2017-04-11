import axios from 'axios';
import jwtDecode from 'jwt-decode';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import { SET_CURRENT_USER, CREATE_USER_SUCCESS } from './actionTypes';

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  };
}

export function createUserSuccess(user) {
  return {
    type: CREATE_USER_SUCCESS,
    user
  };
}

export function isUserExists(identifier) {
  return (dispatch) => axios.get(`/user/findUser/${identifier}`);
}

export function userSignupRequest(userData) {
  return dispatch => axios.post('/user', userData)
    .then((response) => {
      const token = response.data.token;
      const user = response.data.user;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('jwtToken', token);
      setAuthorizationToken(token);
      dispatch(setCurrentUser(jwtDecode(token)));
    });
}



