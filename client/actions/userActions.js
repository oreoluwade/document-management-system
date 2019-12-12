import axios from 'axios';
import { RETRIEVE_USERS_SUCCESS, SET_CURRENT_USER } from './actionTypes';

const apiUrlPrefix = '/api';

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        payload: {
            user
        }
    };
}

export function retrieveUsersSuccess(users) {
    return {
        type: RETRIEVE_USERS_SUCCESS,
        payload: {
            users
        }
    };
}

export function retrieveUsers() {
    return async dispatch => {
        axios.get(`${apiUrlPrefix}/user`).then(response => {
            dispatch(retrieveUsersSuccess(response.data));
        });
    };
}

export function deleteUser(id) {
    return async dispatch => {
        axios.delete(`${apiUrlPrefix}/user/${id}`).then(() => {
            dispatch(retrieveUsers());
        });
    };
}

export function updateUserAdmin(user) {
    return async dispatch => {
        axios.put(`${apiUrlPrefix}/user/${user.id}`, user).then(() => {
            dispatch(retrieveUsers());
        });
    };
}

export const updateUserInfo = (userId, updatePayload) => async dispatch =>
    axios
        .put(`${apiUrlPrefix}/user/${userId}`, updatePayload)
        .then(response => {
            dispatch(setCurrentUser(response.data));
        });

export const getUserInfo = userId => async dispatch => {
    axios.get(`${apiUrlPrefix}/user/${userId}`).then(response => {
        dispatch(setCurrentUser(response.data));
    });
};
