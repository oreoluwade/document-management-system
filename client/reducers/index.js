import { combineReducers } from 'redux';
import flashMessages from './flashMessages';
import handleUsers from './userReducer';
import handleDocuments from './documentReducer';
import manageRoles from './roleReducer';
import auth from './auth';

export const rootReducer = combineReducers({
  auth,
  flashMessages,
  handleUsers,
  handleDocuments,
  manageRoles,
});

export default rootReducer;
