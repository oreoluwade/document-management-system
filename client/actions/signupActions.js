import axios from 'axios';

export default function userSignupRequest(userData) {
  return (dispatch) => axios.post('/user', userData);
}
