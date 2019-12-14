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
    return async dispatch => {
        axios.get(`${apiUrlPrefix}/role`).then(response => {
            dispatch(loadRolesSuccess(response.data));
        });
    };
}

export function saveRole(rolePayload) {
    return async dispatch => {
        axios.post(`${apiUrlPrefix}/role`, rolePayload).then(() => {
            dispatch(loadRoles());
        });
    };
}

export function updateRole(updateData) {
    return async dispatch => {
        axios
            .put(`${apiUrlPrefix}/role/${updateData.id}`, updateData)
            .then(() => {
                dispatch(loadRoles());
            });
    };
}

export function deleteRole(id) {
    return async dispatch => {
        axios.delete(`${apiUrlPrefix}/role/${id}`).then(() => {
            dispatch(loadRoles());
        });
    };
}
