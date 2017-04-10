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
  createDocument: (request, response) => {
    const newDocument = request.body;
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
          return response.status(409)
            .send({ message: 'A Document with that Title already exists' });
        }
        return response.status(201)
          .send({ document, message: 'Document successfully created!' });
      })
      .catch(error => response.status(400).send(error));
  },

  getDocument: (request, response) => {
    // Shouldn't the user come before the document?
    Document.findById(request.params.id)
      .then((foundDocument) => {
        if (!foundDocument) {
          return response.status(404)
            .send({
              message: `No document found with id: ${request.params.id}`
            });
        }

        if (foundDocument.access === accessLevels.public) {
          return response.status(200)
            .send(foundDocument);
        }

        if ((foundDocument.access === accessLevels.private) &&
          (foundDocument.ownerId === request.decoded.id)) {
          return response.status(200)
            .send(foundDocument);
        }
        if (foundDocument.access === accessLevels.role) {
          return User.findById(foundDocument.ownerId)
            .then((documentOwner) => {
              if (documentOwner.roleId === request.decoded.roleId) {
                return response.status(200)
                  .send(foundDocument);
              }
              return response.status(403)
                .send({
                  message: 'You are not permitted to access this document'
                });
            });
        }
        return response.status(403)
          .send({
            message: 'You are not permitted to access this document'
          });
      });
  },

  getDocuments: (request, response) => {
    const { id, userRoleId } = request.decoded;
    if (request.query.limit < 0 || request.query.offset < 0) {
      return response.status(400)
        .send({ message: 'Only Positive integers are permitted.' });
    }

    let query = {
      limit: request.query.limit || null,
      offset: request.query.offset || null,
      order: [['createdAt', 'DESC']]
    };

    const queryoptions = {
      where: {
        $or: [
          { access: 'public' },
          { access: 'role' },
          { ownerId: id }
        ]
      },
      include: [{
        model: User,
        where: { roleId: userRoleId },
        as: 'owner'
      }]
    };

    if (userRoleId !== 1) {
      query = Object.assign({}, query, queryoptions);
    }

    Document.findAll(query)
      .then(documents => response.status(200).send(documents));
  },

  editDocument: (request, response) => {
    Document.findById(request.params.id)
      .then((documentFound) => {
        if (!documentFound) {
          return response.status(404)
            .send({
              message:
              `document with id: ${request.params.id} not found`
            });
        }
        if (documentFound.ownerId === request.decoded.id) {
          documentFound.update(request.body)
            .then(editedDocument => response.status(200)
              .send({ editedDocument, message: 'Update Successful!' }));
        } else {
          return response.status(403)
            .send({ message: 'You are not the owner of this document.' });
        }
      });
  },

  deleteDocument: (request, response) => {
    Document.findById(request.params.id)
      .then((foundDocument) => {
        if (!foundDocument) {
          return response.status(404)
            .send({
              message:
              `document with id: ${request.params.id} not found`
            });
        }
        if (foundDocument.ownerId === request.decoded.id) {
          foundDocument.destroy()
            .then(() => response.status(200)
              .send({ message: 'Document successfully deleted' }));
        } else {
          return response.status(403)
            .send({
              message:
              'You cannot delete a document that does not belong to you.'
            });
        }
      });
  },

  findUserDocuments: (request, response) => {
    Document.findAll({ where: { ownerId: request.params.id } })
      .then((foundDocuments) => {
        if (!foundDocuments) {
          return response.status(404)
            .send({
              message: `No Document(s) found for user with ID
              ${request.params.id}`
            });
        }
        return response.status(200)
          .send(foundDocuments);
      });
  },

  searchDocuments: (request, response) => {
    const queryString = request.query.query;
    const role = Math.abs(request.query.role, 10);
    const publishedDate = request.query.publishedDate;
    const order = /^ASC$/i.test(publishedDate) ? publishedDate : 'DESC';

    const query = {
      where: {
        $and: [{
          $or: [
            { access: 'public' },
            { ownerId: request.decoded.id }
          ]
        }],
      },
      limit: request.query.limit || null,
      offset: request.query.offset || null,
      order: [['createdAt', order]]
    };

    if (queryString) {
      query.where.$and.push({
        $or: [
          { title: { $like: `%${queryString}%` } },
          { content: { $like: `%${queryString}%` } }
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
      .then((foundDocuments) => {
        response.send(foundDocuments);
      });
  }
};
