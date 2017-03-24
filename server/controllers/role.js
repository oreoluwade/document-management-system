import models from '../models';

const Role = models.Role;

module.exports = {
  createRole: (request, response) => {
    Role.findOrCreate({
      where: {
        title: request.body.title
      }
    })
      .spread((role, created) => {
        if (!created) {
          return response.status(400)
            .send({ message: 'Role Already Exists!' });
        }
        return response.status(201)
          .send({ role, message: 'Role Successfully Created!' });
      });
  },

  updateRole: (request, response) => {
    Role.findById(request.params.id)
      .then((role) => {
        if (!role) {
          return response.status(404)
          .send({ message: `No role with id: ${request.params.role}` });
        }

        role.update(request.body)
          .then(updatedRole => response.status(200)
          .send(updatedRole));
      });
  },

  deleteRole: (request, response) => {
    Role.findById(request.params.id)
      .then((role) => {
        if (!role) {
          return response.status(404)
            .send({ message: `No role with id: ${request.params.role}` });
        }
        role.destroy()
          .then(() => response.status(200)
            .send({ message: 'Role Successfully Deleted' }));
      });
  },

  getRole: (request, response) => {
    Role.findById(request.params.id)
      .then((role) => {
        if (!role) {
          return response.status(404)
            .send({ message: `No role with id: ${request.params.role}` });
        }
        return response.status(200)
          .send(role);
      });
  },

  getAllRoles: (request, response) => {
    Role.findAll()
      .then((roles) => {
        if (!roles) {
          return response.status(404).send({ message: 'No Roles Found' });
        }
        return response.status(200).send(roles);
      });
  }
};
