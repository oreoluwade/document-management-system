import { combineReducers } from 'redux';
import { reducer } from 'react-redux-sweetalert';
import flashMessages from './flashMessages';
import handleUsers from './userReducer';
import handleDocuments from './documentReducer';
import manageRoles from './roleReducer';
import auth from './auth';
import handleSearch from './searchReducer';

export const rootReducer = combineReducers({
  auth,
  flashMessages,
  handleUsers,
  handleDocuments,
  handleSearch,
  manageRoles,
  sweetalert: reducer
});

export default rootReducer;
