import axios from 'axios';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import { SET_CURRENT_USER } from './actionTypes';
import { retrieveUserFromToken } from '../utils';

const apiUrlPrefix = '/api';

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        payload: {
            user
        }
    };
}

export function logout() {
    return dispatch => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
        setAuthorizationToken(false);
        dispatch(setCurrentUser({ username: '', id: '', roleId: '' }));
    };
}

export function login(data) {
    return dispatch => {
        axios.post(`${apiUrlPrefix}/user/login`, data).then(response => {
            const {
                token,
                username,
                email,
                firstname,
                lastname,
                roleId,
                id
            } = response.data;
            const user = { username, email, firstname, lastname, roleId, id };
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('jwtToken', token);
            setAuthorizationToken(token);
            retrieveUserFromToken(token).then(decodedUser => {
                dispatch(setCurrentUser(decodedUser));
            });
        });
    };
}
