import axios from 'axios';
import * as types from './actionTypes';

/**
 * Load document success action creator
 * @export
 * @param {any} document
 * @returns {object} action
 */
export function loadDocumentSuccess(document) {
  return {
    type: types.LOAD_DOCUMENT_SUCCESS,
    document
  };
}

/**
 * Create document success action creator
 * @export
 * @param {any} document
 * @returns {object} action
 */
export function createDocumentSuccess(document) {
  return {
    type: types.CREATE_DOCUMENT_SUCCESS,
    document
  };
}

/**
 * Update document success action creator
 * @export
 * @param {any} document
 * @returns {object} action
 */
export function updateDocumentSuccess(document) {
  return {
    type: types.UPDATE_DOCUMENT_SUCCESS,
    document
  };
}

/**
 * Choose a document as the current document action creator
 * @export
 * @param {number} id
 * @returns {object} action
 */
export function chooseAsCurrentDocument(id) {
  return {
    type: types.CHOOSE_AS_CURRENT_DOCUMENT,
    id
  };
}

/**
 * Delete the current document action creator
 * @return {object} actiontype
 */
export function deleteCurrentDocument() {
  return {
    type: types.DELETE_CURRENT_DOCUMENT,
  };
}


/**
 * action creator to get user documents
 * @param {number} userId
 * @returns {function} documents
 */
export function loadUserDocuments(userId) {
  return dispatch => axios.get(`user/${userId}/document`)
    .then((response) => {
      dispatch(loadDocumentSuccess(response.data));
    }).catch((error) => {
      throw (error);
    });
}

/**
 * Action creator to get all documents accessible to current user
 * @returns {object} documents
 */
export function loadAllDocuments() {
  return dispatch => axios.get('/document')
    .then((response) => {
      dispatch(loadDocumentSuccess(response.data));
    }).catch((error) => {
      throw (error);
    });
}

/**
 * Action creator to save a document after adding content and title
 * @param {any} document
 * @param {any} userId
 * @returns {function}
 */
export function saveDocument(document, userId) {
  return dispatch => axios.post('/document/', document)
    .then(() => {
      dispatch(loadUserDocuments(userId));
    }).catch((error) => {
      throw (error);
    });
}

/**
 * Action creator to update details of a document
 * @param {object} document
 * @returns {function}
 */
export function updateDocument(document, userId) {
  return dispatch => axios.put(`/document/${document.id}`, document)
      .then(() => {
        dispatch(loadUserDocuments(userId));
      }).catch((error) => {
        throw (error);
      });
}

/**
 * @export
 * @param {any} id
 * @returns {object} documents
 */
export function deleteDocument(id, userId) {
  return dispatch => axios.delete(`/document/${id}`)
    .then(() => {
      dispatch(loadUserDocuments(userId));
    }).catch((error) => {
      throw (error);
    });
}
