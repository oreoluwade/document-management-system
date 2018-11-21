import jwt from 'jsonwebtoken';
import models from '../models';

const { Role } = models;
const secret = process.env.SECRET || 'secretconfirmation';

export default {
  authenticate(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ message: 'No token provided!' });
    jwt.verify(token, secret, (error, decoded) => {
      if (error) return res.status(401).send(error);
      req.decoded = decoded;
      next();
    });
  },

  authorizeAdmin(req, res, next) {
    Role.findById(req.decoded.userRoleId)
      .then((role) => {
        if (role.title.toLowerCase() === 'admin') return next();
        return res.status(403).send({ message: 'Unauthorized' });
      })
      .catch(err => res.send(err));
  }
};
