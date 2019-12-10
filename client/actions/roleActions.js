import axios from 'axios';
import { LOAD_ROLES_SUCCESS } from './actionTypes';

const apiUrlPrefix = '/api';

export function loadRolesSuccess(roles) {
    return {
        type: LOAD_ROLES_SUCCESS,
        payload: {
            roles
        }
    };
}

export function loadRoles() {
    return dispatch => {
        axios.get(`${apiUrlPrefix}/role`).then(response => {
            dispatch(loadRolesSuccess(response.data));
        });
    };
}

export function saveRole(rolePayload) {
    return dispatch => {
        axios
            .post(`${apiUrlPrefix}/role`, rolePayload)
            .then(() => {
                dispatch(loadRoles());
            })
            .catch(error => {
                throw error;
            });
    };
}

export function updateRole(updateData) {
    return dispatch => {
        axios
            .put(`${apiUrlPrefix}/role/${updateData.id}`, updateData)
            .then(() => {
                dispatch(loadRoles());
            })
            .catch(error => {
                throw error;
            });
    };
}

export function deleteRole(id) {
    return dispatch => {
        axios
            .delete(`${apiUrlPrefix}/role/${id}`)
            .then(() => {
                dispatch(loadRoles());
            })
            .catch(error => {
                throw error;
            });
    };
}
