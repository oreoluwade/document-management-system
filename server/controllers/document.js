import { Op } from 'sequelize';
import models from '../models';

const { Document, User, Role } = models;

export default {
    createDocument(req, res) {
        const { title, ownerId, content, access } = req.body;
        Document.findOrCreate({
            where: { title, ownerId },
            defaults: { title, content, access, ownerId }
        })
            .spread((document, created) => {
                if (!created) {
                    return res.status(409).send({
                        message: 'A Document with that title already exists'
                    });
                }
                return res.status(201).send({
                    document,
                    message: 'Document successfully created!'
                });
            })
            .catch(error => res.status(400).send(error));
    },

    async getDocument(req, res) {
        const document = await Document.findByPk(req.params.id);
        return res.send(document);
    },

    getDocuments(req, res) {
        const { id, roleId } = req.decoded;
        if (req.query.limit < 0 || req.query.offset < 0) {
            return res
                .status(400)
                .send({ message: 'Only Positive integers are permitted.' });
        }

        let query = {
            limit: req.query.limit || null,
            offset: req.query.offset || null,
            order: [['createdAt', 'DESC']]
        };

        const queryoptions = {
            where: {
                [Op.or]: [
                    { access: 'public' },
                    { access: 'role' },
                    { ownerId: id }
                ]
            },
            include: [
                {
                    model: User,
                    where: { roleId },
                    as: 'owner'
                }
            ]
        };

        if (roleId !== 1) {
            query = { ...query, ...queryoptions };
        }

        Document.findAll(query).then(documents => {
            res.status(200).send(documents);
        });
    },

    async editDocument(req, res) {
        const document = await Document.findByPk(req.params.id);
        const updatedDocument = await document.update(req.body);
        return res.send({
            document: updatedDocument,
            message: 'Update Successful!'
        });
    },

    async deleteDocument(req, res) {
        const document = await Document.findByPk(req.params.id);
        await document.destroy();
        res.send({ message: 'Document successfully deleted' });
    },

    async findUserDocuments(req, res) {
        const documents = await Document.findAll({
            where: { ownerId: req.params.id }
        });
        return res.send(documents);
    },

    searchDocuments(req, res) {
        const queryString = req.query.query;
        const role = Math.abs(req.query.role, 10);
        const { publishedDate } = req.query;
        const order = /^ASC$/i.test(publishedDate) ? publishedDate : 'DESC';

        const query = {
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { access: 'public' },
                            { ownerId: req.decoded.id }
                        ]
                    }
                ]
            },
            limit: req.query.limit || null,
            offset: req.query.offset || null,
            order: [['createdAt', order]]
        };

        if (queryString) {
            query.where.$and.push({
                [Op.or]: [
                    { title: { $iLike: `%${queryString}%` } },
                    { content: { $iLike: `%${queryString}%` } }
                ]
            });
        }

        if (role) {
            query.include = [
                {
                    model: User,
                    as: 'owner',
                    attributes: [],
                    include: [
                        {
                            model: Role,
                            attributes: [],
                            where: { id: role }
                        }
                    ]
                }
            ];
        }

        Document.findAll(query).then(foundDocuments => {
            res.send(foundDocuments);
        });
    }
};
