import { SET_CURRENT_USER } from '../actions';
import initialState from './initialState';

export default (state = initialState.user, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        details: action.payload.user
      };

    default:
      return state;
  }
};
