import axios from 'axios';
import {
  LOAD_DOCUMENT_SUCCESS,
  CHOOSE_AS_CURRENT_DOCUMENT,
  DELETE_CURRENT_DOCUMENT,
  LOAD_ALL_DOCUMENTS,
  LOAD_USER_DOCUMENTS
} from './actionTypes';

export function loadDocument(document) {
  return {
    type: LOAD_DOCUMENT_SUCCESS,
    payload: {
      document
    }
  };
}

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

export function updateDocumentSuccess(document) {
  return {
    type: UPDATE_DOCUMENT_SUCCESS,
    payload: {
      document
    }
  };
}

export function chooseAsCurrentDocument(id) {
  return {
    type: CHOOSE_AS_CURRENT_DOCUMENT,
    payload: {
      id
    }
  };
}

export function deleteCurrentDocument(id) {
  return {
    type: DELETE_CURRENT_DOCUMENT,
    payload: {
      id
    }
  };
}

export function loadUserDocuments(id) {
  return dispatch =>
    axios
      .get(`user/${id}/document`)
      .then(response => {
        dispatch(retrieveUserDocuments(response.data));
      })
      .catch(error => {
        throw error;
      });
}

export function loadAllDocuments() {
  return dispatch =>
    axios
      .get('/document')
      .then(response => {
        dispatch(retrieveAllDocuments(response.data));
      })
      .catch(error => {
        throw error;
      });
}

export function saveDocument(document, userId) {
  return dispatch =>
    axios
      .post('/document', document)
      .then(() => {
        dispatch(loadUserDocuments(userId));
      })
      .catch(error => {
        throw error;
      });
}

export function updateDocument(document, userId) {
  return dispatch =>
    axios
      .put(`/document/${document.id}`, document)
      .then(res => {
        console.log('res', res);
        dispatch(loadUserDocuments(userId));
      })
      .catch(error => {
        throw error;
      });
}

export function deleteDocument(id, userId) {
  return dispatch =>
    axios
      .delete(`/document/${id}`)
      .then(() => {
        dispatch(loadUserDocuments(userId));
      })
      .catch(error => {
        throw error;
      });
}

export function searchDocuments(query) {
  return dispatch =>
    axios
      .get(`/documents/search?query=${query}`)
      .then(response => {
        dispatch(loadDocument(response.data));
      })
      .catch(error => {
        throw error;
      });
}
