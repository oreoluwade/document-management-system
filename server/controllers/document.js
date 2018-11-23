import { Op } from 'sequelize';
import models from '../models';

const { Role, User, Document } = models;

const accessLevels = {
  public: 'public',
  private: 'private',
  role: 'role'
};

const isEmpty = (value) => value.trim() === '';

const requiredFields = ['title', 'content'];

export default {
  createDocument(req, res) {
    const unsuppliedRequiredFields = [];
    const emptyFields = [];

    const { id: ownerId } = req.decoded;
    const { title, content, access } = req.body;

    requiredFields.forEach(field => {
      if (!(field in (req.body))) {
        unsuppliedRequiredFields.push(`${field} is required`);
      }
    });

    if (unsuppliedRequiredFields.length) {
      return res.status(403).send({ message: unsuppliedRequiredFields });
    }

    requiredFields.forEach(field => {
      if (isEmpty(req.body[field])) {
        emptyFields.push(`${field} cannot be empty`);
      }
    });

    if (emptyFields.length) {
      return res.status(403).send({ message: emptyFields });
    }

    return Document.findOne({ where: { [Op.and]: [{ title, ownerId }] } })
      .then((docFound) => {
        if (!docFound) {
          return Document.create({ title, content, access, ownerId })
            .then(document => res.status(201).send(document))
            .catch(err => res.send(err));
        }
        return res.status(409).send({ message: 'You already have a document with that title' });
      })
      .catch(error => res.send(error));
  },

  getOneDocument(req, res) {
    Document.findByPk(req.params.id)
      .then((foundDocument) => {
        if (!foundDocument) {
          return res.status(404).send({ message: `No document found with ID: ${req.params.id}` });
        }

        if (foundDocument.access === accessLevels.public) {
          return res.send(foundDocument);
        }

        if ((foundDocument.access === accessLevels.private) &&
          (foundDocument.ownerId === req.decoded.id)) {
          return res.send(foundDocument);
        }
        if (foundDocument.access === accessLevels.role) {
          return User.findByPk(foundDocument.ownerId)
            .then((documentOwner) => {
              if (documentOwner.roleId === req.decoded.roleId) {
                return res.send(foundDocument);
              }
              return res.status(403).send({ message: 'You are not permitted to access this document' });
            });
        }
        return res.status(403).send({ message: 'You are not permitted to access this document' });
      })
      .catch(err => res.send(err));
  },

  getAllDocuments(req, res) {
    const { id, roleId } = req.decoded;
    if (req.query.limit < 0 || req.query.offset < 0) {
      return res.status(400).send({ message: 'Limit/Offset must be a positive integer' });
    }

    let query = {
      limit: req.query.limit || null,
      offset: req.query.offset || null,
      order: [['createdAt', 'DESC']]
    };

    const queryOptions = {
      where: {
        [Op.or]: [
          { access: 'public' },
          { access: 'role' },
          { ownerId: id }
        ]
      },
      include: [{
        model: User,
        where: { roleId },
        as: 'owner'
      }]
    };

    if (roleId !== 1) {
      query = Object.assign({}, query, queryOptions);
    }

    return Document.findAll(query)
      .then((documents) => {
        if (documents.length) return res.send(documents);
        return res.send({ message: 'No Documents created yet' });
      })
      .catch(error => res.send(error));
  },

  editDocument(req, res) {
    Document.findByPk(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404).send({ message: `document with id: ${req.params.id} does not exist` });
        }
        if (document.ownerId === req.decoded.id) {
          const updatableObject = {
            title: req.body.title || document.title,
            content: req.body.content || document.content,
            access: req.body.access || document.access
          };

          document.update(updatableObject)
            .then((updatedDocument) => {
              const responseObject = { ...updatedDocument.dataValues, message: 'Update Successful!' };
              return res.send(responseObject);
            })
            .catch(err => res.send(err));
        } else {
          return res.status(403).send({ message: 'You cannot update a document that isn\'t yours' });
        }
      });
  },

  deleteDocument(req, res) {
    Document.findByPk(req.params.id)
      .then((foundDocument) => {
        if (!foundDocument) {
          return res.status(404)
            .send({
              message:
              `Document with id: ${req.params.id} not found`
            });
        }
        if (foundDocument.ownerId === req.decoded.id) {
          foundDocument.destroy()
            .then(() => res.status(200)
              .send({ message: 'Document successfully deleted' }));
        } else {
          return res.status(403)
            .send({ message: 'You cannot delete a document that does not belong to you' });
        }
      })
      .catch(err => res.send(err));
  },

  getUserDocuments(req, res) {
    if (req.decoded.id === Number(req.params.id) || req.decoded.id === 1) {
      return User.findById(req.params.id)
        .then((user) => {
          if (!user) return res.status(404).send({ message: `No User with ID: ${req.params.id}` });
          return Document.findAll({ where: { ownerId: req.params.id } })
            .then((documents) => {
              if (!documents.length) {
                return res.status(404)
                  .send({
                    message: `User with (ID: ${req.params.id}) has no documents created yet`
                  });
              }
              return res.send(documents);
            });
        });
    }
    return res.send({
      message: `You are not authorized to view the documents for user with ID: ${req.params.id}`
    });
  },

  searchDocuments(req, res) {
    const queryString = req.query.query;
    const role = Math.abs(req.query.role, 10);
    const publishedDate = req.query.publishedDate;
    const order = /^ASC$/i.test(publishedDate) ? publishedDate : 'DESC';

    if (req.query.limit < 0 || req.query.offset < 0) {
      return res.status(400).send({ message: 'Limit/Offset must be a positive integer' });
    }

    if (isNaN(role) || role < 0) {
      return res.status(400).send({ message: 'Role must be a positive integer' });
    }

    const query = {
      where: {
        // [Op.and]: [{
        [Op.or]: [
          { access: 'public' },
          { ownerId: req.decoded.id }
        ]
        // }],
      },
      limit: req.query.limit || null,
      offset: req.query.offset || null,
      order: [['createdAt', order]]
    };

    if (queryString) {
      query.where.Op.and.push({
        [Op.or]: [
          { title: { [Op.iLike]: `%${queryString}%` } },
          { content: { [Op.iLike]: `%${queryString}%` } }
        ]
      });
    }

    if (role) {
      query.include = [{
        model: User,
        as: 'owner',
        attributes: [],
        include: [{
          model: Role,
          attributes: [],
          where: { id: role }
        }]
      }];
    }

    Document.findAll(query)
      .then((documents) => {
        console.log('=========', documents);
        if (!documents.length) return res.status(404).send({ message: 'No matching document found' });
        return res.send(documents);
      })
      .catch(err => res.send(err));
  }
};
