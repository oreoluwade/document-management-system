import axios from 'axios';
import {
  LOAD_DOCUMENT_SUCCESS,
  CHOOSE_AS_CURRENT_DOCUMENT,
  DELETE_CURRENT_DOCUMENT,
  LOAD_DOCUMENTS
} from './actionTypes';

export function loadDocument(document) {
  return {
    type: LOAD_DOCUMENT_SUCCESS,
    payload: {
      document
    }
  };
}

export function retrieveDocuments(documents) {
  return {
    type: LOAD_DOCUMENTS,
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
        dispatch(loadDocument(response.data));
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
        dispatch(loadDocument(response.data));
      })
      .catch(error => {
        throw error;
      });
}

export function saveDocument(document, id) {
  return dispatch =>
    axios
      .post('/document', document)
      .then(() => {
        dispatch(loadUserDocuments(id));
      })
      .catch(error => {
        throw error;
      });
}

export function updateDocument(document, userId) {
  return dispatch =>
    axios
      .put(`/document/${document.id}`, document)
      .then(() => {
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
