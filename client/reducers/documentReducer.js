import * as types from '../actions/actionTypes';
import initialState from './initialState';

function documentReducer(state = initialState.handleDocuments, action) {
  switch (action.type) {
    case types.LOAD_DOCUMENT_SUCCESS:
      return Object.assign({}, ...state, { documents: action.document });

    case types.CHOOSE_AS_CURRENT_DOCUMENT: {
      const chosenDocumentList = state.documents
        .filter(document => document.id === action.id);
      const chosenDocument = chosenDocumentList[0] || {};
      return Object.assign({}, state, { chosenDocument });
    }

    case types.UPDATE_DOCUMENT_SUCCESS:
      return [...state.filter(document => document.id !== action.document.id),
        Object.assign({}, { documents: action.document })
      ];

    default:
      return state;
  }
}

export default documentReducer;
