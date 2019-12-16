import express from 'express';
import userController from '../controllers/user';
import documentController from '../controllers/document';
import { Authorization, RoleValidation, UserValidation } from '../middlewares';

const router = express.Router();

const { validateAdmin, validateToken } = Authorization;
const { roleExists } = RoleValidation;
const { userAlreadyExists, userIdExists } = UserValidation;

router
    .route('/')
    .get(validateToken, validateAdmin, userController.getAllUsers)
    .post(roleExists, userAlreadyExists, userController.createUser);

router.route('/findUser/:identifier').get(userController.fetchExistingUser);

router.route('/login').post(userController.userLogin);

router.route('/logout').post(userController.logout);

router
    .route('/:id')
    .all(validateToken, userIdExists)
    .get(userController.getUser)
    .put(userController.updateUserDetails)
    .delete(userController.deleteUser);

router
    .route('/:id/document')
    .get(validateToken, documentController.findUserDocuments);

export default router;
