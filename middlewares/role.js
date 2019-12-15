import models from '../models';

const { Role } = models;

export default {
    async roleExists(req, res, next) {
        const role = await Role.findByPk(req.body.roleId);
        if (!role) {
            return res.status(404).send({ error: 'Role does not exist' });
        }
        return next();
    }
};
