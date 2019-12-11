import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import models from '../models';

const { Role, User, Document } = models;
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

        const user = await User.create({
            username,
            firstname,
            lastname,
            email,
            password,
            roleId
        });

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
    },

    async getUser(req, res) {
        const user = await User.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: Document
                }
            ],
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
    },

    async getAllUsers(req, res) {
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

        return res.send(users);
    },

    async updateUserDetails(req, res) {
        const user = await User.findByPk(req.params.id);
        const updatedUser = await user.update(req.body);

        const {
            id,
            username,
            roleId,
            firstname,
            lastname,
            email
        } = updatedUser;

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
    },

    async deleteUser(req, res) {
        await User.destroy({
            where: {
                id: req.params.id
            }
        });

        return res.send({ message: 'User deleted!' });
    },

    async userLogin(req, res) {
        const { identifier, password } = req.body;
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: identifier }, { username: identifier }]
            }
        });

        if (!user) {
            return res.status(404).send({ error: 'Invalid Credentials' });
        }
        const passwordIsValid = await user.validPassword(password);

        console.log(password);

        if (!passwordIsValid) {
            return res.status(401).send({ error: 'Invalid Credentials' });
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
                return res.status(409).send({ error: 'User already exists' });
            })
            .catch(error => res.status(501).send({ error }));
    }
};
