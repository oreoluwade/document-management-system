import models from '../models';

const { Role } = models;

export default {
  createRole(req, res) {
    const { title } = req.body;
    Role.findOne({ where: { title } })
      .then((roleExists) => {
        if (roleExists) {
          return res.status(409).json({ message: 'Role Already Exists!' })
        }
        Role.create({ title })
          .then((role) => {
            const responseObject = { ...role.dataValues, message: 'Role Successfully Created!' };
            return res.send(responseObject);
          })
          .catch(error => res.send(error));
      })
      .catch(err => res.send(err));
  },

  updateRole(req, res) {
    Role.findById(req.params.id)
      .then((role) => {
        if (!role) return res.status(404).send({ message: `No role with id: ${req.params.role}` });
        role.update(req.body.title)
          .then(updatedRole => res.status(200)
          .send(updatedRole));
      });
  },

  deleteRole(req, res) {
    Role.findById(req.params.id)
      .then((role) => {
        if (!role) return res.status(404).send({ message: `No role with id: ${req.params.role}` });
        role.destroy()
          .then(() => res.send({ message: 'Role Successfully Deleted' }))
          .catch(error => res.send({ error }));
      })
      .catch(err => res.send(err));
  },

  getRole(req, res) {
    Role.findById(req.params.id)
      .then((role) => {
        if (!role) return res.status(404).send({ message: `No role with id: ${req.params.role}` });
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
