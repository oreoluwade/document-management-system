import models from '../models';

const Document = models.Document;
const User = models.User;
const Role = models.Role;

const accessLevels = {
    public: 'public',
    private: 'private',
    role: 'role'
};

module.exports = {
    createDocument: (req, res) => {
        const newDocument = req.body;
        Document.findOrCreate({
            where: {
                title: newDocument.title,
                ownerId: newDocument.ownerId
            },
            defaults: {
                title: newDocument.title,
                content: newDocument.content,
                access: newDocument.access,
                ownerId: newDocument.ownerId
            }
        })
            .spread((document, created) => {
                if (!created) {
                    return res
                        .status(409)
                        .send({
                            message: 'A Document with that Title already exists'
                        });
                }
                return res
                    .status(201)
                    .send({
                        document,
                        message: 'Document successfully created!'
                    });
            })
            .catch(error => res.status(400).send(error));
    },

    getDocument: (req, res) => {
        // Shouldn't the user come before the document?
        Document.findById(req.params.id).then(foundDocument => {
            if (!foundDocument) {
                return res.status(404).send({
                    message: `No document found with id: ${req.params.id}`
                });
            }

            if (foundDocument.access === accessLevels.public) {
                return res.status(200).send(foundDocument);
            }

            if (
                foundDocument.access === accessLevels.private &&
                foundDocument.ownerId === req.decoded.id
            ) {
                return res.status(200).send(foundDocument);
            }
            if (foundDocument.access === accessLevels.role) {
                return User.findById(foundDocument.ownerId).then(
                    documentOwner => {
                        if (documentOwner.roleId === req.decoded.roleId) {
                            return res.status(200).send(foundDocument);
                        }
                        return res.status(403).send({
                            message:
                                'You are not permitted to access this document'
                        });
                    }
                );
            }
            return res.status(403).send({
                message: 'You are not permitted to access this document'
            });
        });
    },

    getDocuments: (req, res) => {
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
                $or: [{ access: 'public' }, { access: 'role' }, { ownerId: id }]
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
            query = Object.assign({}, query, queryoptions);
        }

        Document.findAll(query).then(documents =>
            res.status(200).send(documents)
        );
    },

    editDocument: (req, res) => {
        Document.findById(req.params.id).then(documentFound => {
            if (!documentFound) {
                return res.status(404).send({
                    message: `document with id: ${req.params.id} not found`
                });
            }
            if (documentFound.ownerId === req.decoded.id) {
                documentFound
                    .update(req.body)
                    .then(editedDocument =>
                        res
                            .status(200)
                            .send({
                                editedDocument,
                                message: 'Update Successful!'
                            })
                    );
            } else {
                return res
                    .status(403)
                    .send({
                        message: 'You are not the owner of this document.'
                    });
            }
        });
    },

    deleteDocument: (req, res) => {
        Document.findById(req.params.id).then(foundDocument => {
            if (!foundDocument) {
                return res.status(404).send({
                    message: `document with id: ${req.params.id} not found`
                });
            }
            if (foundDocument.ownerId === req.decoded.id) {
                foundDocument
                    .destroy()
                    .then(() =>
                        res
                            .status(200)
                            .send({ message: 'Document successfully deleted' })
                    );
            } else {
                return res.status(403).send({
                    message:
                        'You cannot delete a document that does not belong to you.'
                });
            }
        });
    },

    findUserDocuments: (req, res) => {
        Document.findAll({ where: { ownerId: req.params.id } }).then(
            foundDocuments => {
                if (!foundDocuments) {
                    return res.status(404).send({
                        message: `No Document(s) found for user with ID
              ${req.params.id}`
                    });
                }
                return res.send(foundDocuments);
            }
        );
    },

    searchDocuments: (req, res) => {
        const queryString = req.query.query;
        const role = Math.abs(req.query.role, 10);
        const publishedDate = req.query.publishedDate;
        const order = /^ASC$/i.test(publishedDate) ? publishedDate : 'DESC';

        const query = {
            where: {
                $and: [
                    {
                        $or: [{ access: 'public' }, { ownerId: req.decoded.id }]
                    }
                ]
            },
            limit: req.query.limit || null,
            offset: req.query.offset || null,
            order: [['createdAt', order]]
        };

        if (queryString) {
            query.where.$and.push({
                $or: [
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
