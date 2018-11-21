import express from 'express';
import documentController from '../controllers/document';
import authorization from '../middlewares/authorization';

const router = express.Router();

router.route('/')
  .all(authorization.validateToken)
  .get(documentController.getDocuments)
  .post(documentController.createDocument);

router.route('/search')
  .get(authorization.validateToken, documentController.searchDocuments);

router.route('/:id')
  .all(authorization.validateToken)
  .get(documentController.getDocument)
  .put(documentController.editDocument)
  .delete(documentController.deleteDocument);

export default router;
