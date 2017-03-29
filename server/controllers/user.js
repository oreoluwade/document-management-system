// import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import models from '../models';

const Role = models.Role;
const User = models.User;
const secret = process.env.SECRET || 'secretconfirmation';

module.exports = {
  createUser: (request, response) => {
    const newUser = request.body;
    Role.find({ where: { id: newUser.roleId } })
      .then((userFound) => {
        if (!userFound) {
          return response.status(400)
            .send({ message: 'Invalid roleId specified' });
        }
        User.findOrCreate({
          where: {
            email: newUser.email
          },
          defaults: {
            userName: newUser.userName,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            password: newUser.password,
            roleId: newUser.roleId
          },
        })
          .spread((user, created) => {
            if (created) {
              const token = jwt.sign({
                userId: user.id,
                userName: user.userName,
                userRoleId: user.roleId
              }, secret, { expiresIn: '1 day' });
              return response.status(201).send({
                user: {
                  id: user.id,
                  userName: user.userName,
                  userRoleId: user.roleId,
                  email: user.email
                },
                token,
                message: 'New User Created! Token expires in one day.'
              });
            }
            return response.status(400)
              .send({ message: 'User Already Exists!' });
          });
      });
  },

  getUser: (request, response) => {
    User.findById(request.params.id)
      .then((userFound) => {
        if (userFound) {
          return response.status(200).send(userFound);
        }
        return response.status(404).send({ message: 'User Not Found' });
      });
  },

  getAllUsers: (request, response) => {
    User.findAll({}).then((usersFound) => {
      if (usersFound) {
        return response.status(200).send({ usersFound });
      }
      return response.status(404).send({ message: 'No Users Found' });
    });
  },

  updateUserDetails: (request, response) => {
    User.findById(request.params.id)
      .then((user) => {
        if (!user) {
          return response.status(404).send({ message: 'User not found' });
        }
        user.update(request.body)
          .then((updatedUser) => {
            const token = jwt.sign({
              userId: updatedUser.id,
              userName: updatedUser.userName,
              userRoleId: updatedUser.roleId
            }, secret, { expiresIn: '1 day' });
            return response.status(200).send({
              user: {
                userId: updatedUser.id,
                userName: updatedUser.userName,
                userRoleId: updatedUser.userId,
                email: updatedUser.email
              },
              token,
              message: 'Update Successful! Token expires in one day.'
            });
          });
      });
  },

  deleteUser: (request, response) => {
    User.destroy({
      where: {
        id: request.params.id
      }
    })
      .then((userFound) => {
        if (userFound === 1) {
          return response.status(200).send({ message: 'User Removed' });
        }
        return response.status(404).send({ message: 'User Not found' });
      });
  },

  userLogin: (request, response) => {
    if (!request.body.userName || !request.body.password) {
      return response.status(401).send({
        message: 'Invalid request, specify userName and password'
      });
    }
    User.find({
      where: {
        userName: request.body.userName
      }
    })
      .then((userFound) => {
        if (!userFound) {
          return response.status(404)
            .send({ message: 'User does not exist. Login Failed!' });
        }
        if (!userFound.validPassword(request.body.password)) {
          return response.status(404)
            .send({ message: 'Invalid userName or password' });
        }
        const token = jwt.sign({
          userId: userFound.id,
          userName: userFound.userName,
          userRoleId: userFound.roleId
        }, secret, { expiresIn: '1 day' });
        return response.status(200).send({
          user: {
            userName: userFound.userName,
            userId: userFound.id,
            userRoleId: userFound.roleId,
            email: userFound.email
          },
          token,
          message: 'Login Successful! Token expires in one day.'
        });
      });
  },

  userLogout: (request, response) => {
    response.status(200).send({ message: 'User Successfully logged out!' });
  },

  fetchExistingUser: (request, response) =>
    User
      .find({
        where: {
          $or: [
            { email: request.params.identifier },
            { userName: request.params.identifier }
          ]
        }
      })
      .then((user) => {
        if (!user) {
          return response.status(200).send({ message: 'User can be created' });
        }
        return response.status(400).send({ message: 'User already exists' });
      })
      .catch(error => response.status(501).send({
        error, message: 'An error occurred while retrieving the user'
      }))
};
