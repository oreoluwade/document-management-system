import axios from 'axios';
import { RETRIEVE_USERS_SUCCESS, GET_USER_INFO_SUCCESS } from './actionTypes';

export function retrieveUsersSuccess(users) {
  return {
    type: RETRIEVE_USERS_SUCCESS,
    payload: {
      users
    }
  };
}

// export function updateUserSuccess(user) {
//   return {
//     type: types.UPDATE_USER_SUCCESS,
//     user
//   };
// }

export function getUserInfoSuccess(user) {
  return {
    type: GET_USER_INFO_SUCCESS,
    user
  };
}

export function retrieveUsers() {
  return dispatch =>
    axios
      .get('/user')
      .then(response => {
        dispatch(retrieveUsersSuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
}

export function deleteUser(id) {
  return dispatch =>
    axios
      .delete(`/user/${id}`)
      .then(() => {
        dispatch(retrieveUsers());
      })
      .catch(error => {
        throw error;
      });
}

export function updateUserAdmin(user) {
  return dispatch =>
    axios
      .put(`/user/${user.id}`, user)
      .then(() => {
        dispatch(retrieveUsers());
      })
      .catch(error => {
        throw error;
      });
}

// export function updateUserInfo(userInfo) {
//   const user = JSON.parse(localStorage.getItem('user'));
//   return dispatch =>
//     axios
//       .put(`/user/${user.id}`, userInfo)
//       .then(response => {
//         dispatch(updateUserSuccess(userInfo));
//       })
//       .catch(error => {
//         throw error;
//       });
// }

export function getUserInfo() {
  const user = JSON.parse(localStorage.getItem('user'));
  return dispatch =>
    axios
      .get(`/user/${user.id}`)
      .then(response => {
        dispatch(getUserInfoSuccess(response.data));
      })
      .catch(error => {
        throw error;
      });
}
