import express from 'express';
import { userController, documentController } from '../controllers';
import authorization from '../middlewares';

const router = express.Router();

router.route('/all')
  .get(authorization.authenticate, authorization.authorizeAdmin, userController.getAllUsers);

router.route('/register')
  .post(userController.createUser);

router.route('/:id')
  .all(authorization.authenticate)
  .get(userController.getOneUser)
  .put(userController.updateUserDetails)
  .delete(userController.deleteUser);

router.route('/checkUser/:identifier')
  .get(userController.checkUserExistence);

router.route('/:id/document')
  .get(authorization.authenticate, documentController.findUserDocuments);

router.route('/login')
  .post(userController.login);

router.route('/logout')
  .delete(userController.logout);

export default router;
