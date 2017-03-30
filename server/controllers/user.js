// import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import models from '../models';
import validateInput from '../shared/validations/signup';

const Role = models.Role;
const User = models.User;
const secret = process.env.SECRET || 'secretconfirmation';

module.exports = {
  createUser: (request, response) => {
    const newUser = request.body;



    Role.find({ where: { id: newUser.roleId } })
      .then((userFound) => {
        if (!userFound) {
          response.status(400).json({ error: 'The role ID is invalid' });
        }
        const { errors, isValid } = validateInput(newUser);

        if (!isValid) {
          response.status(400).json(errors);
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
              }, secret);
              response.status(201).json({
                user: {
                  id: user.id,
                  userName: user.userName,
                  userRoleId: user.roleId,
                  email: user.email
                },
                token
              });
            }
            response.status(400).json({ error: 'User Already Exists!' });
          });
      });
  },

  getUser: (request, response) => {
    User.findById(request.params.id)
      .then((userFound) => {
        if (userFound) {
          response.status(200).json(userFound);
        }
        response.status(404).json({ error: 'User Not Found' });
      });
  },

  getAllUsers: (request, response) => {
    User.findAll({}).then((usersFound) => {
      if (usersFound) {
        response.status(200).json({ usersFound });
      }
      response.status(404).json({ message: 'No Users Found' });
    });
  },

  updateUserDetails: (request, response) => {
    User.findById(request.params.id)
      .then((user) => {
        if (!user) {
          response.status(404).json({ error: 'User not found' });
        }
        user.update(request.body)
          .then((updatedUser) => {
            const token = jwt.sign({
              userId: updatedUser.id,
              userName: updatedUser.userName,
              userRoleId: updatedUser.roleId
            }, secret);
            return response.status(200).json({
              user: {
                userId: updatedUser.id,
                userName: updatedUser.userName,
                userRoleId: updatedUser.userId,
                email: updatedUser.email
              },
              token
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
    const { identifier, password } = request.body;
    // if (!request.body.userName || !request.body.password) {
    //   return response.status(401).send({
    //     message: 'Invalid request, specify userName and password'
    //   });
    // }
    User.find({
      where: {
        $or: [
          { email: identifier },
          { userName: identifier }
        ]
      }
      // where: {
      //   userName: request.body.userName
      // }
    })
      .then((user) => {
        if (!user) {
          return response.status(401)
            .json({ errors: { form: 'Invalid Credentials' } });
        }
        if (!user.validPassword(password)) {
          return response.status(401)
            .json({ errors: { form: 'Invalid Credentials' } });
        }
        const token = jwt.sign({
          userId: user.id,
          userName: user.userName,
          userRoleId: user.roleId
        }, secret);
        // return response.status(200).send({
        //   user: {
        //     userName: user.userName,
        //     userId: user.id,
        //     userRoleId: user.roleId,
        //     email: user.email
        //   },
        //   token,
        //   message: 'Login Successful! Token expires in one day.'
        // });
        response.json({ token });
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
          response.status(200).json({ error: 'User can be created' });
        }
        response.status(400).json({ error: 'User already exists' });
      })
      .catch(error => response.status(501).json({
        error, err: 'An error occurred while retrieving the user'
      }))
};
