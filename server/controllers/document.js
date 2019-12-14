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

  async getDocuments(req, res) {
    const { id, roleId } = req.decoded;
    if (req.query.limit < 0 || req.query.offset < 0) {
      return res
        .status(400)
        .send({ message: 'Only Positive integers are permitted.' });
    }

    const query = {
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User
        }
      ],
      limit: Number(req.query.limit) || null,
      offset: Number(req.query.offset) || null,
      subQuery: false
    };

    const allDocuments = await Document.findAll(query);

    if (roleId !== 1) {
      const filteredDocuments = allDocuments.filter(
        doc =>
          doc.access === 'public' ||
          doc.ownerId === id ||
          (doc.access === 'role' && doc.User.roleId === roleId)
      );
      return res.send(filteredDocuments);
    } else {
      return res.send(allDocuments);
    }
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

    const initialRestrictions =
      req.decoded.roleId === 1
        ? []
        : [
            {
              [Op.or]: [{ access: 'public' }, { ownerId: req.decoded.id }]
            }
          ];

    const query = {
      where: {
        [Op.and]: initialRestrictions
      },
      limit: req.query.limit || null,
      offset: req.query.offset || null,
      order: [['createdAt', order]]
    };

    if (queryString) {
      query.where[Op.and].push({
        [Op.or]: [
          { title: { [Op.iLike]: `%${queryString}%` } },
          { content: { [Op.iLike]: `%${queryString}%` } }
        ]
      });
    }

    if (role) {
      query.include = [
        {
          model: User,
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
      return res.send(foundDocuments);
    });
  }
};
