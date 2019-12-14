import { SET_CURRENT_USER, RESET } from '../actions';
import initialState from './initialState';

export default (state = initialState.auth, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: Object.values(action.payload.user).every(
          item => !!item
        )
      };

    case RESET:
      return initialState.auth;

    default:
      return state;
  }
};
