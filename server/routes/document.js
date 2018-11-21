import express from 'express';
import { documentController } from '../controllers';
import authorization from '../middlewares';

const router = express.Router();

router.route('/add')
  .post(authorization.authenticate, documentController.createDocument);

router.route('/all')
  .get(authorization.authenticate, documentController.getAllDocuments);

router.route('/search')
  .get(authorization.authenticate, documentController.searchDocuments);

router.route('/:id')
  .all(authorization.authenticate)
  .get(documentController.getOneDocument)
  .put(documentController.editDocument)
  .delete(documentController.deleteDocument);

export default router;
