import { combineReducers } from 'redux';
import auth from './auth';
import user from './user';
import admin from './admin';

export const rootReducer = combineReducers({
  auth,
  admin,
  user
});

export default rootReducer;
