// import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import models from '../models';

const { Role, User } = models;
const secret = process.env.SECRET || 'secretconfirmation';

export default {
    async createUser(req, res) {
        const {
            email,
            username,
            firstname,
            lastname,
            password,
            roleId
        } = req.body;

        try {
            await Role.findByPk(roleId);
            User.findOrCreate({
                where: {
                    email
                },
                defaults: {
                    username,
                    firstname,
                    lastname,
                    email,
                    password,
                    roleId
                }
            }).spread((user, created) => {
                if (created) {
                    const token = jwt.sign(
                        {
                            id: user.id,
                            username: user.username,
                            roleId: user.roleId
                        },
                        secret
                    );
                    return res.status(201).send({
                        id: user.id,
                        username: user.username,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        roleId: user.roleId,
                        email: user.email,
                        token
                    });
                }
                return res.status(409).send({ error: 'User already exists!' });
            });
        } catch (error) {
            console.log('Error', error);
            return res.status(400).send({ error: 'Role does not exist' });
        }
    },

    async getUser(req, res) {
        try {
            const user = await User.findOne({
                where: { id: req.params.id },
                attributes: [
                    'id',
                    'username',
                    'firstname',
                    'lastname',
                    'roleId',
                    'createdAt',
                    'updatedAt'
                ]
            });
            return res.send(user);
        } catch (error) {
            res.status(404).send({ error: 'User does not exist' });
        }
    },

    async getAllUsers(req, res) {
        try {
            const users = await User.findAll({
                include: [{ model: Role }],
                attributes: [
                    'id',
                    'username',
                    'firstname',
                    'lastname',
                    'roleId',
                    'createdAt',
                    'updatedAt'
                ]
            });
            if (users.length) {
                return res.send(users);
            } else {
                return res.status(404).send({ message: 'No users found' });
            }
        } catch (error) {
            res.status(500).send({ error: 'An error occured' });
        }
    },

    updateUserDetails(req, res) {
        User.findByPk(req.params.id).then(user => {
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            } else {
                user.update(req.body).then(
                    ({ id, username, roleId, firstname, lastname, email }) => {
                        const token = jwt.sign(
                            {
                                id,
                                username,
                                roleId
                            },
                            secret
                        );
                        return res.send({
                            id,
                            username,
                            firstname,
                            lastname,
                            roleId,
                            email,
                            token
                        });
                    }
                );
            }
        });
    },

    deleteUser(req, res) {
        User.destroy({
            where: {
                id: req.params.id
            }
        }).then(userFound => {
            if (userFound === 1) {
                return res.send({ message: 'User deleted!' });
            }
            return res.status(404).send({ message: 'User not found' });
        });
    },

    userLogin: (req, res) => {
        const { identifier, password } = req.body;
        User.find({
            where: {
                $or: [{ email: identifier }, { userName: identifier }]
            }
        }).then(user => {
            if (!user) {
                return res
                    .status(401)
                    .json({ errors: { form: 'Invalid Credentials' } });
            }
            if (!user.validPassword(password)) {
                return res
                    .status(401)
                    .json({ errors: { form: 'Invalid Credentials' } });
            }
            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    roleId: user.roleId
                },
                secret
            );
            return res.send({
                id: user.id,
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                roleId: user.roleId,
                email: user.email,
                token,
                message: 'Login Successful! Token expires in one day.'
            });
        });
    },

    userLogout(req, res) {
        res.send({ message: 'User Successfully logged out!' });
    },

    fetchExistingUser(req, res) {
        User.findOne({
            where: {
                [Op.or]: [
                    { email: req.params.identifier },
                    { username: req.params.identifier }
                ]
            }
        })
            .then(user => {
                if (!user) {
                    return res.send({ message: 'User can be created' });
                }
                return res.status(400).send({ error: 'User already exists' });
            })
            .catch(error => {
                console.log(error);
                return res.status(501).send({
                    error,
                    err: 'An error occurred while retrieving the user'
                });
            });
    }
};
