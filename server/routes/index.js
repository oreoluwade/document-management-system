import express from 'express';
import roleController from '../controllers/role';
import userController from '../controllers/user';
import documentController from '../controllers/document';
import authorization from '../middlewares/authorization';

const router = express.Router();

// Role route to create and get multiple roles
router.route('/role')
  .all(authorization.validateToken, authorization.validateAdmin)
  .get(roleController.getAllRoles)
  .post(roleController.createRole);

// Role route for single user data sending and getting
router.route('/role/:id')
  .all(authorization.validateToken, authorization.validateAdmin)
  .get(roleController.getRole)
  .put(roleController.updateRole)
  .delete(roleController.deleteRole);


// All purpose User route
router.route('/user')
  .get(authorization.validateToken, authorization.validateAdmin, userController.getAllUsers)
  .post(userController.createUser);

// Route for single user
router.route('/user/:id')
  .get(authorization.validateToken, userController.getUser)
  .put(authorization.validateToken, userController.updateUserDetails)
  .delete(authorization.validateToken, userController.deleteUser);

// Route for single user documents
router.route('/user/:id/document')
  .get(authorization.validateToken, documentController.findUserDocuments);

// Route for user login
router.route('/user/login')
  .post(userController.userLogin);

// route for user logout
router.route('/user/logout')
  .post(userController.userLogout);


// All-purpose Document route
router.route('/document')
  .all(authorization.validateToken)
  .get(documentController.getDocuments)
  .post(documentController.createDocument);

// Single-user route
router.route('/document/:id')
  .all(authorization.validateToken)
  .get(documentController.getDocument)
  .put(documentController.editDocument)
  .delete(documentController.deleteDocument);

// Document search route
router.route('/document/search')
  .post(authorization.validateToken, documentController.searchDocuments);

module.exports = router;
