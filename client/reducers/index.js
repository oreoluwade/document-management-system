import { combineReducers } from 'redux';
import auth from './auth';
import user from './user';
import admin from './admin';
import documents from './documents';

export const rootReducer = combineReducers({
    auth,
    admin,
    user,
    documents
});

export default rootReducer;
