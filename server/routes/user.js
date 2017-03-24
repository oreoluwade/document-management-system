import express from 'express';
import userController from '../controllers/user';
import documentController from '../controllers/document';
import authorization from '../middlewares/authorization';

const router = express.Router();

router.route('/')
  .get(authorization.validateToken, authorization.validateAdmin, userController.getAllUsers)
  .post(userController.createUser);

router.route('/:id')
  .get(authorization.validateToken, userController.getUser)
  .put(authorization.validateToken, userController.updateUserDetails)
  .delete(authorization.validateToken, userController.deleteUser);

router.route('/:id/document')
  .get(authorization.validateToken, documentController.findUserDocuments);

router.route('/login')
  .post(userController.userLogin);

router.route('/logout')
  .post(userController.userLogout);

module.exports = router;
