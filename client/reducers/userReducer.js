import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function userReducer(state = initialState.handleUsers, action = {}) {
  switch (action.type) {
    case types.RETRIEVE_USERS_SUCCESS:
      return Object.assign({}, ...state, { users: action.users });
    case types.UPDATE_USER_SUCCESS:
      return Object.assign({}, ...state, { users: action.user });
    case types.GET_USER_INFO_SUCCESS:
      return Object.assign({}, ...state, { user: action.user });
    default:
      return state;
  }
}
