import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function userReducer(state = initialState.handleUsers, action = {}) {
  switch (action.type) {
    case types.RETRIEVE_USERS_SUCCESS:
      return Object.assign({}, ...state, { users: action.users });

    default:
      return state;
  }
}
