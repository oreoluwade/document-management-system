import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import models from '../models';

const { Role, User } = models;
const secret = process.env.SECRET || 'secretconfirmation';

export default {
  createUser(req, res) {
    const { userName, firstName, lastName, email, password, roleId } = req.body;
    Role.find({ where: { id: roleId } })
      .then((roleIdExists) => {
        if (!roleIdExists) return res.status(400).json({ error: 'The role ID is invalid' });
        User.find({ where: { email } })
          .then((userFound) => {
            if (userFound) return res.status(409).send({ message: 'User Already Exists!' });
            User.create({ userName, firstName, lastName, email, password })
              .then((createdUser) => {
                const token = jwt.sign({
                  id: createdUser.id,
                  userName: createdUser.userName,
                  roleId: createdUser.roleId
                }, secret);

                const responseObject = { ...createdUser.dataValues, token };
                return res.send(responseObject);
              })
              .catch(error => res.send(error));
          });
      })
      .catch(err => res.send(err));
  },

  getOneUser(req, res) {
    User.findById(req.params.id)
      .then((user) => {
        const responseObject = { ...user.dataValues };
        delete responseObject.password;
        if (user) return res.send(responseObject);
        return res.status(404).send({ error: `No user with ID: ${req.params.id}` });
      });
  },

  getAllUsers(req, res) {
    User.findAll({ include: [{ model: Role }] }).then((users) => {
      const responseObject = users.map(user => ({
        id: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.Role.title
      }));

      if (users) return res.send(responseObject);
      return res.status(404).send({ message: 'No Users Found' });
    });
  },

  updateUserDetails: (req, res) => {
    User.findById(req.params.id)
      .then((user) => {
        if (!user) return res.status(404).send({ error: 'User does not exist' });
        const updateObject = { ...req.body };
        const barredUpdateFields = ['createdAt', 'updatedAt', 'roleId', 'id'];

        // delete fields we don't intend to update
        Object.keys(updateObject).forEach((field) => {
          if (barredUpdateFields.includes(field)) {
            delete updateObject.field;
          }
        });

        const identifierIsToBeUpdated = Object.keys(updateObject).includes('email') ||
          Object.keys(updateObject).includes('userName');

        if (identifierIsToBeUpdated) {
          if (updateObject.email) {
            return User.find({ where: { email: updateObject.email } })
              .then((result) => {
                if (result) return res.status(409).send({ error: 'Email already in use' });
              });
          }

          if (updateObject.userName) {
            return User.find({ where: { userName: updateObject.userName } })
              .then((result) => {
                if (result) return res.status(409).send({ error: 'Username already in use' });
              });
          }
        }

        user.update(updateObject)
          .then((updatedUser) => {
            const token = jwt.sign({
              id: updatedUser.id,
              userName: updatedUser.userName,
              roleId: updatedUser.roleId
            }, secret);

            const responseObject = { ...updatedUser.dataValues, token };
            delete responseObject.password;

            return res.send(responseObject);
          })
          .catch(err => res.send(err));
      });
  },

  deleteUser(req, res) {
    const { id } = req.params;
    User.destroy({ where: { id } })
      .then((user) => {
        if (user === 1) {
          return res.status(200).send({ message: 'User Removed' });
        }
        return res.status(404).send({ message: 'User Not found' });
      });
  },

  login(req, res) {
    const { identifier, password } = req.body;
    User.find({
      where: {
        [Op.or]: [
          { email: identifier },
          { userName: identifier }
        ]
      }
    })
      .then((user) => {
        if (!user) return res.status(401).send({ error: 'Invalid Credentials' });
        if (!user.validPassword(password)) {
          return res.status(401).send({ error: 'Invalid Credentials' });
        }

        const token = jwt.sign({
          id: user.id,
          userName: user.userName,
          roleId: user.roleId
        }, secret);

        const responseObject = {
          ...user.dataValues,
          token,
          message: 'Login Successful! Token expires in one day.'
        };

        delete responseObject.password;
        return res.send(responseObject);
      });
  },

  logout(req, res) {
    return res.send({ message: 'Logout successful.' });
  },

  checkUserExistence(req, res) {
    const { identifier } = req.params;
    User.find({
      where: {
        [Op.or]: [
          { email: identifier },
          { userName: identifier }
        ]
      }
    })
      .then((user) => {
        if (!user) return res.send({ userExists: false });
        return res.status(400).send({ userExists: true });
      })
      .catch(error => res.status(501).send(error));
  }
};
