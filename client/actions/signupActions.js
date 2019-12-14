import axios from 'axios';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import { SET_CURRENT_USER } from './actionTypes';

const apiUrlPrefix = '/api';

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        payload: {
            user
        }
    };
}

export function userAlreadyExists(identifier) {
    return () => axios.get(`${apiUrlPrefix}/user/findUser/${identifier}`);
}

export function registerUser(userData) {
    return async dispatch => {
        const response = await axios.post(`${apiUrlPrefix}/user`, userData);
        const {
            username,
            firstname,
            lastname,
            roleId,
            email,
            id,
            token
        } = response.data;
        const user = { username, firstname, lastname, roleId, email, id };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('jwtToken', token);
        setAuthorizationToken(token);
        dispatch(setCurrentUser(user));
    };
}
