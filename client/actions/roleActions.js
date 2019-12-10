import axios from 'axios';
import { LOAD_ROLES_SUCCESS } from './actionTypes';

export function loadRolesSuccess(roles) {
  return {
    type: LOAD_ROLES_SUCCESS,
    payload: {
      roles
    }
  };
}

export function loadRoles() {
  return dispatch =>
    axios.get('/role').then(response => {
      console.log('Roles?', response.data);
      dispatch(loadRolesSuccess(response.data));
    });
}

export function saveRole(rolePayload) {
  return dispatch =>
    axios
      .post('/role', rolePayload)
      .then(() => {
        dispatch(loadRoles());
      })
      .catch(error => {
        throw error;
      });
}

export function updateRole(updateData) {
  return dispatch =>
    axios
      .put(`/role/${updateData.id}`, rolupdateDatae)
      .then(() => {
        dispatch(loadRoles());
      })
      .catch(error => {
        throw error;
      });
}

export function deleteRole(id) {
  return dispatch =>
    axios
      .delete(`/role/${id}`)
      .then(() => {
        dispatch(loadRoles());
      })
      .catch(error => {
        throw error;
      });
}
