import axios from 'axios';
// import jwtDecode from 'jwt-decode';
import * as types from './actionTypes';

// import setAuthorizationToken from '../utils/setAuthorizationToken';

/**
 * action to successfully get a user
 * @export
 * @param {any} user
 * @returns  {object} user
 */
export function retrieveUserSuccess(user) {
  return {
    type: types.RETRIEVE_USERS_SUCCESS,
    user
  };
}


/**
 * action to get a user, given the ID
 * @export
 * @param {any} name
 * @returns {string} name
 */
export function getUserByIdSuccess(name) {
  return {
    type: types.GET_USER_SUCCESSS,
    name
  };
}

/**
 * action to select any particular user
 * @export
 * @param {any} id
 * @returns {number}
 */
export function setChosenUser(id) {
  return {
    type: types.SET_CHOSEN_USER,
    id
  };
}



/**
 * action to show a selected user
 * @export
 * @param {any} id
 * @returns {number}
 */
export function displayChosenUser(id) {
  return {
    type: types.DISPLAY_CHOSEN_USER,
    id
  };
}



/**
 * action to delete a user
 * @export
 * @returns {any}
 */
export function deleteChosenUser() {
  return {
    type: types.DELETE_CHOSEN_USER
  };
}


/**
 * dispatching the action to get users
 * @export
 * @returns {object}
 */
export function retrieveUsers() {
  return (dispatch) => {
    return axios.get('/user')
      .then((response) => {
        dispatch(retrieveUserSuccess(response.data.user));
      }).catch((error) => {
        throw (error);
      });
  };
}


/**
 * dispatching the action to get a particular user
 * @export
 * @param {any} id
 * @returns {object}
 */
export function getUserById(id) {
  return (dispatch) => {
    return axios.get(`/user/${id}`)
      .then((response) => {
        dispatch(getUserByIdSuccess(response.data.user.name));
      }).catch((error) => {
        throw (error);
      });
  };
}


/**
 * dispatching the action to update a user details
 * @export
 * @param {any} user
 * @returns {object}
 */
export function updateUserAdmin(user) {
  return (dispatch, getState) => {
    const userId = getState().handleUsers.chosenUser;
    return axios.put(`/user/${userId}`, user)
      .then(() => {
        dispatch(retrieveUsers());
      }).catch((error) => {
        throw (error);
      });
  };
}


/**
 * dispatching the action to save a user
 * @export
 * @param {any} user
 * @returns {object}
 */
export function saveUserAdmin(user) {
  return (dispatch) => {
    return axios.post('/user', user)
      .then(() => {
        dispatch(retrieveUsers());
      }).catch((error) => { throw (error); });
  };
}
