import axios from 'axios';
import types from './actionTypes';

/**
 * action to successfully load a role from state
 * @param  {object} role
 * @return {object}
 */
export function loadRoleSuccess(role) {
  return {
    type: types.LOAD_ROLE_SUCCESS,
    role
  };
}

/**
 * set selected role in state
 * @param {any} id
 * @returns {any} role id
 */
export function setCurrentRole(id) {
  return {
    type: types.SET_CURRENT_ROLE,
    id
  };
}

/**
 * delete currently selected role from state
 * @return {[type]}
 */
export function deleteCurrentRole() {
  return {
    type: types.DELETE_CURRENT_ROLE,
  };
}

/**
 * load role
 * @return {object} object of roles
 */
export function loadRoles() {
  return (dispatch) => {
    return axios.get('/role')
      .then((response) => {
        dispatch(loadRoleSuccess(response.data.role));
      });
  };
}

/**
 * save new role
 * @param  {object} role
 * @return {object}
 */
export function saveRole(role) {
  return (dispatch) => {
    return axios.post('/role', role)
      .then(() => {
        dispatch(loadRoles());
      });
  };
}

/**
 * @param  {object} role
 * @return {object}
 */
export function updateRole(role) {
  return (dispatch, getState) => {
    const roleId = getState().manageRoles.selectedRole;
    return axios.put(`/role/${roleId}`, role)
      .then(() => {
        dispatch(loadRoles());
      });
  };
}

/**
 * delete role from db
 * @param  {number} id
 * @return {object}
 */
export function deleteRole(id) {
  return (dispatch) => {
    return axios.delete(`/role/${id}`)
      .then(() => {
        dispatch(loadRoles());
      });
  };
}
