import isEmpty from 'lodash/isEmpty';
import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function userReducer(state = initialState.handleUsers, action = {}) {
  switch (action.type) {
    case types.RETRIEVE_USER_SUCCESS:
      return [
        ...state,
        Object.assign({}, { owner: action.name })
      ];

    case types.RETRIEVE_USERS_SUCCESS:
      return Object.assign({}, ...state, { allUsers: action.user });

    case types.DISPLAY_CHOSEN_USER:
      return Object.assign({}, state, { userDetails: !isEmpty(action.id) });

    case types.DELETE_CHOSEN_USER: {
      const newState = JSON.parse(JSON.stringify(state));
      delete newState.chosenUser;
      return newState;
    }

    default:
      return state;
  }
}
