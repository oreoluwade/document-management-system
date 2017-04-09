import axios from 'axios';
import jwtDecode from 'jwt-decode';
import * as types from './actionTypes';
import setAuthorizationToken from '../Utils/setAuthorizationToken';

export function setCurrentUser(user) {
  return { type: types.SET_CURRENT_USER, user };
}

export function retrieveUsersSuccess(users) {
  return { type: types.RETRIEVE_USERS_SUCCESS, users };
}

export function getUserSuccess(user) {
  return { type: types.GET_USER_SUCCESS, user };
}

export function updateUserSuccess(user) {
  return { type: types.UPDATE_USER_SUCCESS, user };
}

export function getUserInfoSuccess(user) {
  return { type: types.GET_USER_INFO_SUCCESS, user };
}

export function isUserExists(identifier) {
  return dispatch => axios.get(`/user/findUser/${identifier}`);
}

export function userSignupRequest(userData) {
  return dispatch => axios.post('/user', userData);
}

export function login(data) {
  return dispatch => axios.post('/user/login', data)
    .then((response) => {
      const token = response.data.token;
      const user = response.data.user;
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuthorizationToken(token);
      dispatch(setCurrentUser(jwtDecode(token)));
    });
}

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('jwtToken');
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  };
}

export function retrieveUsers() {
  return dispatch => axios.get('/user')
    .then((response) => {
      dispatch(retrieveUsersSuccess(response.data.usersFound));
    }).catch((error) => {
      throw (error);
    });
}

export function getUserById(id) {
  return dispatch => axios.get(`/user/${id}`)
    .then((response) => {
      dispatch(getUserSuccess(response.data.userFound));
    }).catch((error) => {
      throw (error);
    });
}



export function updateUserAdmin(user) {
  return dispatch => axios.put(`/user/${user.id}`, user)
      .then(() => {
        dispatch(retrieveUsers());
      }).catch((error) => {
        throw (error);
      });
}


export function updateUser(user) {
  return dispatch => axios.put(`/user/${user.id}`, user)
      .then(() => {
        dispatch(getUserById());
      }).catch((error) => {
        throw (error);
      });
}

export function deleteUser(id) {
  return dispatch => axios.delete(`/user/${id}`)
    .then(() => {
      dispatch(retrieveUsers());
    }).catch((error) => {
      throw (error);
    });
}












// export function updateUserInfo(userInfo) {
//   const user = JSON.parse(localStorage.getItem('user'));
//   return dispatch => axios.put(`/user/${user.userId}`, userInfo)
//     .then((response) => {
//       console.log(response, 'response');
//       dispatch(updateUserSuccess(userInfo));
//     }).catch((error) => {
//       throw error;
//     });
// }

// export function getUserInfo() {
//   const user = JSON.parse(localStorage.getItem('user'));
//   return dispatch => axios.get(`/user/${user.userId}`)
//     .then((response) => {
//       dispatch(getUserInfoSuccess(response.data));
//     }).catch((error) => {
//       throw error;
//     });
// }




