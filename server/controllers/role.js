import models from '../models';

const { Role } = models;

export default {
  createRole(req, res) {
    const { title } = req.body;
    const bodyDoesNotIncludeTitle = !Object.keys(req.body).includes('title');
    const titleIsAnEmptyString = title && !title.trim();
    if (bodyDoesNotIncludeTitle || titleIsAnEmptyString) return res.status(400).send({ message: 'You must supply a valid title' });
    Role.findOne({ where: { title } })
      .then((roleExists) => {
        if (roleExists) {
          return res.status(409).send({ message: 'Role Already Exists!' });
        }
        Role.create({ title })
          .then((role) => {
            const responseObject = { ...role.dataValues, message: 'Role Successfully Created!' };
            return res.status(201).send(responseObject);
          })
          .catch(error => res.send(error));
      })
      .catch(err => res.send(err));
  },

  updateRole(req, res) {
    Role.findByPk(req.params.id)
      .then((role) => {
        if (!role) return res.status(404).send({ message: `No role with id: ${req.params.id}` });
        Role.findAll()
          .then((foundRoles) => {
            const roleTitles = foundRoles.map(item => item.title);
            if (roleTitles.includes(req.body.title)) {
              if (role.title === req.body.title) {
                return res.send(role);
              }
              return res.status(409).send({ message: 'Role already exists' });
            }
            role.update({ title: req.body.title })
              .then(updatedRole => res.status(200).send(updatedRole));
          });
      });
  },

  deleteRole(req, res) {
    Role.findByPk(req.params.id)
      .then((role) => {
        if (!role) return res.status(404).send({ message: `No role with id: ${req.params.id}` });
        if (Number(req.params.id) === req.decoded.id) {
          return res.status().send({ message: 'You cannot delete admin' });
        }
        role.destroy()
          .then(() => res.send({ message: 'Role Successfully Deleted' }))
          .catch(error => res.send({ error }));
      })
      .catch(err => res.send(err));
  },

  getRole(req, res) {
    Role.findByPk(req.params.id)
      .then((role) => {
        if (!role) return res.status(404).send({ message: `No role with id: ${req.params.id}` });
        return res.send(role);
      });
  },

  getAllRoles(req, res) {
    Role.findAll()
      .then((roles) => {
        if (!roles) return res.status(404).send({ message: 'No roles created yet' });
        return res.send(roles);
      });
  }
};
