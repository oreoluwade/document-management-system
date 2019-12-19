import express from 'express';
import roleController from '../controllers/role';
import { Authorization, RoleValidation } from '../middlewares';

const router = express.Router();

const { validateAdmin, validateToken } = Authorization;
const { roleFromParamExists } = RoleValidation;

router
    .route('/')
    .post(roleController.createRole)
    .all(validateToken, validateAdmin)
    .get(roleController.getAllRoles);

router
    .route('/:id')
    .all(validateToken, validateAdmin)
    .get(roleController.getRole)
    .put(roleFromParamExists, roleController.updateRole)
    .delete(roleFromParamExists, roleController.deleteRole);

export default router;
