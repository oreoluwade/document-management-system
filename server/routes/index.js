// import express from 'express';
import roleController from '../controllers/role';
import userController from '../controllers/user';
import documentController from '../controllers/document';
import authorization from '../middlewares/authorization';

// const app = express.app();

const Routes = app => {
    // Role route to create and get multiple roles
    app.route('/role')
        .post(roleController.createRole)
        .all(authorization.validateToken, authorization.validateAdmin)
        .get(roleController.getAllRoles);

    // Role route for single user data sending and getting
    app.route('/role/:id')
        .all(authorization.validateToken, authorization.validateAdmin)
        .get(roleController.getRole)
        .put(roleController.updateRole)
        .delete(roleController.deleteRole);

    // All purpose User route
    app.route('/user')
        .get(
            authorization.validateToken,
            authorization.validateAdmin,
            userController.getAllUsers
        )
        .post(userController.createUser);

    // Route for early information that user exists
    app.route('/user/findUser/:identifier').get(
        userController.fetchExistingUser
    );

    // Route for single user
    app.route('/user/:id')
        .get(authorization.validateToken, userController.getUser)
        .put(authorization.validateToken, userController.updateUserDetails)
        .delete(authorization.validateToken, userController.deleteUser);

    // Route for single user documents
    app.route('/user/:id/document').get(
        authorization.validateToken,
        documentController.findUserDocuments
    );

    // Route for user login
    app.route('/user/login').post(userController.userLogin);

    // route for user logout
    app.route('/user/logout').post(userController.userLogout);

    // All-purpose Document route
    app.route('/document')
        .all(authorization.validateToken)
        .get(documentController.getDocuments)
        .post(documentController.createDocument);

    // Document search route
    app.route('/documents/search').get(
        authorization.validateToken,
        documentController.searchDocuments
    );

    // Single-user route
    app.route('/document/:id')
        .all(authorization.validateToken)
        .get(documentController.getDocument)
        .put(documentController.editDocument)
        .delete(documentController.deleteDocument);
};

export default Routes;
