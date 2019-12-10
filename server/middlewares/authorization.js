import jwt from 'jsonwebtoken';
import models from '../models';

const { Role } = models;
const secret = process.env.SECRET || 'secretconfirmation';

export default {
    validateToken(request, response, next) {
        const token = request.headers.authorization;
        if (!token) {
            return response.status(401).send({ error: 'No token provided!' });
        }
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                return response.status(401).send({ error: 'Token invalid' });
            }
            request.decoded = decoded;
            next();
        });
    },

    async validateAdmin(request, response, next) {
        const role = await Role.findByPk(request.decoded.roleId);
        if (role.title.toLowerCase() === 'admin') {
            next();
        } else {
            return response.status(403).send({ error: 'Unauthorized' });
        }
    }
};
