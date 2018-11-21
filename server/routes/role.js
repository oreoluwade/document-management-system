import express from 'express';
import roleController from '../controllers/role';
import authorization from '../middlewares/authorization';

const router = express.Router();

router.route('/')
  .all(authorization.authenticate, authorization.authorizeAdmin)
  .get(roleController.getAllRoles)
  .post(roleController.createRole);


router.route('/:id')
  .all(authorization.authenticate, authorization.authorizeAdmin)
  .get(roleController.getRole)
  .put(roleController.updateRole)
  .delete(roleController.deleteRole);

export default router;
