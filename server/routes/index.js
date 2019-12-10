import roleController from '../controllers/role';
import userController from '../controllers/user';
import documentController from '../controllers/document';
import {
    Authorization,
    RoleValidation,
    UserValidation,
    DocumentValidation
} from '../middlewares';

const { validateAdmin, validateToken } = Authorization;
const { roleExists } = RoleValidation;
const { userAlreadyExists, userIdExists } = UserValidation;
const {
    isDocumentOwner,
    documentExists,
    documentIsRetrievable
} = DocumentValidation;

const apiUrlPrefix = '/api';

const Routes = app => {
    // Role route to create and get multiple roles
    app.route(`${apiUrlPrefix}/role`)
        .post(roleController.createRole)
        .all(validateToken, validateAdmin)
        .get(roleController.getAllRoles);

    // Role route for single user data sending and getting
    app.route(`${apiUrlPrefix}/role/:id`)
        .all(validateToken, validateAdmin)
        .get(roleController.getRole)
        .put(roleController.updateRole)
        .delete(roleController.deleteRole);

    // All purpose User route
    app.route(`${apiUrlPrefix}/user`)
        .get(validateToken, validateAdmin, userController.getAllUsers)
        .post(roleExists, userAlreadyExists, userController.createUser);

    // Route for early information that user exists
    app.route(`${apiUrlPrefix}/user/findUser/:identifier`).get(
        userController.fetchExistingUser
    );

    // Route for single user
    app.route(`${apiUrlPrefix}/user/:id`)
        .all(validateToken, userIdExists)
        .get(userController.getUser)
        .put(userController.updateUserDetails)
        .delete(userController.deleteUser);

    // Route for single user documents
    app.route(`${apiUrlPrefix}/user/:id/document`).get(
        validateToken,
        documentController.findUserDocuments
    );

    // login
    app.route(`${apiUrlPrefix}/user/login`).post(userController.userLogin);

    // logout
    app.route(`${apiUrlPrefix}/user/logout`).post(userController.userLogout);

    // All-purpose Document route
    app.route(`${apiUrlPrefix}/document`)
        .all(validateToken)
        .get(documentController.getDocuments)
        .post(documentController.createDocument);

    // Document search route
    app.route(`${apiUrlPrefix}/documents/search`).get(
        validateToken,
        documentController.searchDocuments
    );

    // Document actions
    app.route(`${apiUrlPrefix}/document/:id`)
        .all(validateToken)
        .get(
            documentExists,
            documentIsRetrievable,
            documentController.getDocument
        )
        .put(documentExists, isDocumentOwner, documentController.editDocument)
        .delete(
            documentExists,
            isDocumentOwner,
            documentController.deleteDocument
        );
};

export default Routes;
