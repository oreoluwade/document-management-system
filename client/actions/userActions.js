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

export function updateUserSuccess(user) {
  return {
    type: types.UPDATE_USER_SUCCESS,
    user
  };
}

export function getUserInfoSuccess(user) {
  return {
    type: types.GET_USER_INFO_SUCCESS,
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

export function updateUserInfo(userInfo) {
  const user = JSON.parse(localStorage.getItem('user'));
  return dispatch => axios.put(`/user/${user.userId}`, userInfo)
    .then((response) => {
      console.log(response, 'response');
      dispatch(updateUserSuccess(userInfo));
    }).catch((error) => {
      throw error;
    });
}

export function getUserInfo() {
  const user = JSON.parse(localStorage.getItem('user'));
  return dispatch => axios.get(`/user/${user.userId}`)
    .then((response) => {
      dispatch(getUserInfoSuccess(response.data));
    }).catch((error) => {
      throw error;
    });
}
