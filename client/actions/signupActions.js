import axios from 'axios';
import jwtDecode from 'jwt-decode';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import { SET_CURRENT_USER, CREATE_USER_SUCCESS } from './actionTypes';


/**
 * setCurrentUser description
 * @export
 * @param {any} user
 * @returns {object}
 */
export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER,
    user
  };
}


/**
 * createUserSuccess description
 * @export
 * @param {any} user
 * @returns {object}
 */
export function createUserSuccess(user) {
  return {
    type: CREATE_USER_SUCCESS,
    user
  };
}


/**
 * isUserExists description
 * @export
 * @param {any} identifier
 * @returns {function}
 */
export function isUserExists(identifier) {
  return dispatch => axios.get(`/user/findUser/${identifier}`);
}


/**
 * userSignupRequest description
 * @export
 * @param {any} userData
 * @returns {function}
 */
export function userSignupRequest(userData) {
  return dispatch => axios.post('/user', userData)
  .then((response) => {
    const token = response.data.token;
    dispatch(createUserSuccess(response.data.newUser));
    localStorage.setItem('jwtToken', token);
    setAuthorizationToken(token);
    dispatch(setCurrentUser(jwtDecode(token)));
  });
}

