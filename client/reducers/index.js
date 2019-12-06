import { combineReducers } from 'redux';
import { reducer } from 'react-redux-sweetalert';
import handleUsers from './userReducer';
import handleDocuments from './documentReducer';
import manageRoles from './roleReducer';
import auth from './auth';

export const rootReducer = combineReducers({
    auth,
    handleUsers,
    handleDocuments,
    manageRoles,
    sweetalert: reducer
});

export default rootReducer;
