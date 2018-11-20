import isEmpty from 'lodash/isEmpty';
import { SET_CURRENT_USER } from '../actions/actionTypes';
import initialState from './initialState';

export default (state = initialState, action = {}) => {
  let returnValue;
  switch (action.type) {
    case SET_CURRENT_USER:
      returnValue = {
        isAuthenticated: !isEmpty(action.user),
        user: action.user
      };
      break;
    default:
      returnValue = state;
      break;
  }
  return returnValue;
};
