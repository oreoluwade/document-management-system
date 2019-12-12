import axios from 'axios';
import {
  LOAD_DOCUMENT_SUCCESS,
  LOAD_ALL_DOCUMENTS,
  LOAD_USER_DOCUMENTS
} from './actionTypes';

const apiUrlPrefix = '/api';

export function retrieveAllDocuments(documents) {
  return {
    type: LOAD_ALL_DOCUMENTS,
    payload: {
      documents
    }
  };
}

export function retrieveUserDocuments(documents) {
  return {
    type: LOAD_USER_DOCUMENTS,
    payload: {
      documents
    }
  };
}

export function loadUserDocuments(id) {
  return dispatch => {
    axios
      .get(`${apiUrlPrefix}/user/${id}/document`)
      .then(response => {
        dispatch(retrieveUserDocuments(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}

export function loadAllDocuments() {
  return dispatch => {
    axios
      .get(`${apiUrlPrefix}/document`)
      .then(response => {
        dispatch(retrieveAllDocuments(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
}

export const saveDocument = (document, userId) => {
  return async dispatch => {
    axios
      .post(`${apiUrlPrefix}/document`, document)
      .then(() => {
        dispatch(loadUserDocuments(userId));
      })
      .catch(error => {
        throw error;
      });
  };
};

export const updateDocument = (document, userId) => {
  return async dispatch => {
    axios
      .put(`${apiUrlPrefix}/document/${document.id}`, document)
      .then(res => {
        console.log('res', res);
        dispatch(loadUserDocuments(userId));
      })
      .catch(error => {
        throw error;
      });
  };
};

export function deleteDocument(id, userId) {
  return dispatch => {
    axios
      .delete(`${apiUrlPrefix}/document/${id}`)
      .then(() => {
        dispatch(loadUserDocuments(userId));
      })
      .catch(error => {
        throw error;
      });
  };
}
