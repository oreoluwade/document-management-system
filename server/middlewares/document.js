import models from '../models';

const { Document, User } = models;

export default {
  async fieldsRequired(req, res, next) {
    const requiredFields = ['title', 'content', 'access'];
    const errorArray = [];

    requiredFields.forEach(field => {
      if (!Object.keys(req.body).includes(field)) {
        errorArray.push(`${field} is required`);
      }
    });

    if (errorArray.length) {
      return res.status(400).send({ error: JSON.stringify(errorArray) });
    } else {
      return next();
    }
  },

  async emptyFields(req, res, next) {
    const payloadFields = ['title', 'content', 'access'];
    const errorArray = [];

    payloadFields.forEach(field => {
      if (!req.body[field].trim().length) {
        errorArray.push(`${field} should not be empty`);
      }
    });

    if (errorArray.length) {
      return res.status(400).send({ error: JSON.stringify(errorArray) });
    } else {
      return next();
    }
  },

  async isDocumentOwner(req, res, next) {
    const document = await Document.findByPk(req.params.id);
    if (document.ownerId === req.decoded.id) {
      return next();
    }
    return res.status(401).send({
      error: 'Access denied. Document does not belong to you'
    });
  },

  async documentExists(req, res, next) {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).send({ error: 'Document does not exist' });
    }
    return next();
  },

  async documentIsRetrievable(req, res, next) {
    const document = await Document.findByPk(req.params.id);
    const owner = await User.findByPk(document.ownerId);
    const permittedByRole = owner.roleId === req.decoded.roleId;
    const meetsRequirements =
      document.access === 'public' ||
      document.ownerId === req.decoded.id ||
      (document.access === 'role' && permittedByRole);
    if (meetsRequirements) {
      return next();
    }
    return res.status(401).send({
      error: 'Access denied.'
    });
  }
};
