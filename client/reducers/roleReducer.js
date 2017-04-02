import * as types from '../actions/actionTypes';
import initialState from './initialState';

/**
 * [roleReducer description]
 * @param  {object} [state=initialState.manageRoles] initial state
 * @param  {object} action
 * @return {object}
 */
export default function roleReducer(state = initialState.manageRoles, action) {
  switch (action.type) {
    case types.LOAD_ROLE_SUCCESS:
      return Object.assign({}, ...state, { roles: action.role });

    case types.SET_CURRENT_ROLE:
      return Object.assign({}, state, { selectedRole: action.id });

    case types.DELETE_CURRENT_ROLE: {
      const newState = JSON.parse(JSON.stringify(state));
      delete newState.selectedRole;
      return newState;
    }

    default:
      return state;
  }
}
