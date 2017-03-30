import jwt from 'jsonwebtoken';
import models from '../models';

const Role = models.Role;
const User = models.User;
const secret = process.env.SECRET || 'secretconfirmation';

// export default (request, response, next) => {
//   const authorizationHeader = request.headers.authorization;
//   let token;

//   if (authorizationHeader) {
//     token = authorizationHeader.split(' ')[1];
//   }

//   if (token) {
//     jwt.verify(token, secret, (error, decoded) => {
//       if (error) {
//         response.status(401).json({ error: 'failed to authenticate' });
//       } else {
//         User.query({
//           where: { id: decoded.id },
//           select: ['email', 'id', 'userName']
//         }).fetch().then((user) => {
//           if (!user) {
//             response.status(404).json({ error: 'No such user exists' });
//           }
//           request.currentUser = user;
//           next();
//         });
//       }
//     });
//   } else {
//     response.status(403).json({ error: 'No token provided' });
//   }
// };

module.exports = {
  validateToken: (request, response, next) => {
    const token = request.headers.authorization;

    if (token) {
      jwt.verify(token, secret, (error, decoded) => {
        if (error) {
          response.status(401).json({ error: 'Failed to authenticate!' });
        } else {
          User.query({
            where: { id: decoded.id },
            select: ['email', 'id', 'userName']
          }).fetch().then((user) => {
            if (!user) {
              response.status(404).json({ error: 'No such user exists' });
            }
            request.currentUser = user;
            next();
          });
        }
      });
    } else {
      response.status(403).json({ error: 'No token provided!' });
    }
  },

  validateAdmin: (request, response, next) => {
    Role.findById(request.user.userRoleId)
      .then((role) => {
        if (role.title.toLowerCase() === 'admin') {
          next();
        } else {
          return response.status(403).json({ error: 'User unauthorized' });
        }
      });
  }
};
