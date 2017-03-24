import jwt from 'jsonwebtoken';
import models from '../models';

const Role = models.Role;
const secret = process.env.SECRET || 'secretconfirmation';

module.exports = {
  validateToken: (request, response, next) => {
    const token = request.headers.authorization;
    if (!token) {
      return response.status(401)
        .send({ message: 'No token provided!' });
    }
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return response.status(401)
          .send({ message: 'Invalid token, user not authorized!' });
      }
      request.decoded = decoded; // means what?
      next();
    });
  },

  validateAdmin: (request, response, next) => {
    Role.findById(request.decoded.userRoleId)
      .then((roleFound) => {
        if (roleFound.title.toLowerCase() === 'admin') {
          next();
        } else {
          return response.status(403)
            .send({ message: 'User is not authorized for this request.' });
        }
      });
  }
};
