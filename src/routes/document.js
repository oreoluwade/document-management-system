import express from 'express';
import documentController from '../controllers/document';
import { Authorization, DocumentValidation } from '../middlewares';

const router = express.Router();

const { validateToken } = Authorization;
const {
    isDocumentOwner,
    documentExists,
    documentIsRetrievable,
    fieldsRequired,
    emptyFields
} = DocumentValidation;

router
    .route('/')
    .all(validateToken)
    .get(documentController.getDocuments)
    .post(fieldsRequired, emptyFields, documentController.createDocument);

router.route('/search').get(validateToken, documentController.searchDocuments);

router
    .route('/:id')
    .all(validateToken)
    .get(documentExists, documentIsRetrievable, documentController.getDocument)
    .put(documentExists, isDocumentOwner, documentController.editDocument)
    .delete(documentExists, isDocumentOwner, documentController.deleteDocument);

export default router;
