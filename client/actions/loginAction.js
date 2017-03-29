import axios from 'axios';

export function login(data) {
  return dispatch => {
    return axios.post('/user/login', data);
  };
}
