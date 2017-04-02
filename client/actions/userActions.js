import axios from 'axios';
// import jwtDecode from 'jwt-decode';
import * as types from './actionTypes';

// import setAuthorizationToken from '../utils/setAuthorizationToken';

export function retrieveUserSuccess(user) {
  return {
    type: types.RETRIEVE_USERS_SUCCESS,
    user
  };
}

export function getUserByIdSuccess(name) {
  return {
    type: types.GET_USER_SUCCESSS,
    name
  };
}

export function setChosenUser(id) {
  return {
    type: types.SET_CHOSEN_USER,
    id
  };
}

export function displayChosenUser(id) {
  return {
    type: types.DISPLAY_CHOSEN_USER,
    id
  };
}

export function deleteChosenUser() {
  return {
    type: types.DELETE_CHOSEN_USER
  };
}

// action for getting existing users
export function retrieveUsers() {
  return (dispatch) => {
    return axios.get('/user').then((response) => {
      dispatch(retrieveUserSuccess(response.data.user));
    }).catch((error) => {
      throw (error);
    });
  };
}

// action for getting a particular based on id
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

// admin user action (updating a user details)
export function updateUserAdmin(user) {
  return (dispatch, getState) => {
    const userId = getState().handleUsers.chosenUser;
    return axios.put(`/user/${userId}`, user).then(() => {
      dispatch(retrieveUsers());
    }).catch((err) => {
      throw (err);
    });
  };
}

// admin user action (saving a user as an admin)
export function saveUserAdmin(user) {
  return (dispatch) => {
    return axios.post('/user', user)
    .then(() => {
      dispatch(retrieveUsers());
    }).catch((error) => { throw (error); });
  };
}
