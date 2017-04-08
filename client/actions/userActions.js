import axios from 'axios';
import * as types from './actionTypes';

/**
 * action to successfully get a user
 * @export
 * @param {any} users
 * @returns  {object} user
 */
export function retrieveUsersSuccess(users) {
  return {
    type: types.RETRIEVE_USERS_SUCCESS,
    users
  };
}

/**
 * action to successfully get a user
 * @export
 * @param {any} user
 * @returns  {object} user
 */
export function getUserSuccess(user) {
  return {
    type: types.GET_USER_SUCCESS,
    user
  };
}

/**
 * dispatching the action to get users
 * @export
 * @returns {object}
 */
export function retrieveUsers() {
  return dispatch => axios.get('/user')
    .then((response) => {
      dispatch(retrieveUsersSuccess(response.data.usersFound));
    }).catch((error) => {
      throw (error);
    });
}

/**
 * dispatching the action to get users
 * @param {any} id
 * @export
 * @returns {object}
 */
export function deleteUser(id) {
  return dispatch => axios.delete(`/user/${id}`)
    .then(() => {
      dispatch(retrieveUsers());
    }).catch((error) => {
      throw (error);
    });
}

/**
 * dispatching the action to update a user details
 * @export
 * @param {any} user
 * @returns {object}
 */
export function updateUserAdmin(user) {
  return dispatch => axios.put(`/user/${user.id}`, user)
      .then(() => {
        dispatch(retrieveUsers());
      }).catch((error) => {
        throw (error);
      });
}

/**
 * dispatching the action to get users
 * @param {any} id
 * @export
 * @returns {object}
 */
export function getUserById(id) {
  return dispatch => axios.get(`/user/${id}`)
    .then((response) => {
      dispatch(getUserSuccess(response.data.userFound));
    }).catch((error) => {
      throw (error);
    });
}

