import express from 'express';
import roleController from '../controllers/role';
import authorization from '../middlewares/authorization';

const router = express.Router();

router.route('/')
  .all(authorization.validateToken, authorization.validateAdmin)
  .get(roleController.getAllRoles)
  .post(roleController.createRole);

router.route('/:id')
  .all(authorization.validateToken, authorization.validateAdmin)
  .get(roleController.getRole)
  .put(roleController.updateRole)
  .delete(roleController.deleteRole);

module.exports = router;
