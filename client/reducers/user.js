import {
  SET_CURRENT_USER,
  LOAD_ALL_DOCUMENTS,
  LOAD_USER_DOCUMENTS
} from '../actions';
import initialState from './initialState';

export default (state = initialState.user, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        details: action.payload.user
      };

    case LOAD_ALL_DOCUMENTS:
      return {
        ...state,
        documents: action.payload.documents
      };

    case LOAD_USER_DOCUMENTS:
      return {
        ...state,
        personalDocuments: action.payload.documents
      };

    default:
      return state;
  }
};
