import { combineReducers } from 'redux';
// import { reducer } from 'react-redux-sweetalert';
// import handleUsers from './userReducer';
// import authUser from './documentReducer';
// import manageRoles from './roleReducer';
import auth from './auth';
import user from './user';
import admin from './admin';

export const rootReducer = combineReducers({
  auth,
  admin,
  user
});

export default rootReducer;
