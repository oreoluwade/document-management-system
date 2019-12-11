import axios from 'axios';
import {
    RETRIEVE_USERS_SUCCESS,
    GET_USER_INFO_SUCCESS,
    SET_CURRENT_USER
} from './actionTypes';

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

export function getUserInfoSuccess(user) {
    return {
        type: GET_USER_INFO_SUCCESS,
        user
    };
}

export function retrieveUsers() {
    return dispatch => {
        axios
            .get(`${apiUrlPrefix}/user`)
            .then(response => {
                dispatch(retrieveUsersSuccess(response.data));
            })
            .catch(error => {
                throw error;
            });
    };
}

export function deleteUser(id) {
    return dispatch => {
        axios
            .delete(`${apiUrlPrefix}/user/${id}`)
            .then(() => {
                dispatch(retrieveUsers());
            })
            .catch(error => {
                throw error;
            });
    };
}

export function updateUserAdmin(user) {
    return dispatch => {
        axios
            .put(`${apiUrlPrefix}/user/${user.id}`, user)
            .then(() => {
                dispatch(retrieveUsers());
            })
            .catch(error => {
                throw error;
            });
    };
}

export const updateUserInfo = (userId, updatePayload) => async dispatch =>
    axios
        .put(`${apiUrlPrefix}/user/${userId}`, updatePayload)
        .then(response => {
            console.log('After update', response.data);
            dispatch(setCurrentUser(response.data));
        });

export const getUserInfo = userId => async dispatch => {
    axios.get(`${apiUrlPrefix}/user/${userId}`).then(response => {
        console.log('userinfo', response.data);
        dispatch(setCurrentUser(response.data));
    });
};
