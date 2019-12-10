import initialState from './initialState';
import { RETRIEVE_USERS_SUCCESS, LOAD_ROLES_SUCCESS } from '../actions';

export default (state = initialState.admin, action) => {
  switch (action.type) {
    case RETRIEVE_USERS_SUCCESS:
      return { ...state, users: action.payload.users };

    case LOAD_ROLES_SUCCESS:
      return { ...state, roles: action.payload.roles };

    default:
      return state;
  }
};
