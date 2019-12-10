import { Op } from 'sequelize';
import models from '../models';

const { User } = models;

export default {
    async userAlreadyExists(req, res, next) {
        const { username, email } = req.body;
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });

        if (user) {
            return res.status(409).send({ error: 'User already exists!' });
        }
        return next();
    },

    async userIdExists(req, res, next) {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).send({ error: 'User does not exist' });
        }
        return next();
    }
};
