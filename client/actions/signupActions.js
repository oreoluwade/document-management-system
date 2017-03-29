import axios from 'axios';

export function userSignupRequest(userData) {
  return (dispatch) => axios.post('/user', userData);
}

export function isUserExists(identifier) {
  return (dispatch) => axios.get(`/user/findUser/${identifier}`);
}

