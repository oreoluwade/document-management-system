import axios from 'axios';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import { SET_CURRENT_USER } from './actionTypes';

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    };
}

export function isUserExists(identifier) {
    return dispatch => axios.get(`/user/findUser/${identifier}`);
}

export function userSignupRequest(userData) {
    return dispatch =>
        axios.post('/user', userData).then(response => {
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
        });
}
