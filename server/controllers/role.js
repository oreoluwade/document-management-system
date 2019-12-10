import models from '../models';

const { Role } = models;

export default {
  async createRole(req, res) {
    const { title } = req.body;
    if (!title.trim().length) {
      return res.status(400).send({ error: 'Please provide a valid title' });
    } else {
      try {
        await Role.create({ title: title.trim() });
        return res.status(201).send({ message: 'Success' });
      } catch (error) {
        return res.status(409).send({ message: 'Role already exists!' });
      }
    }
  },

  async updateRole(req, res) {
    try {
      const role = await Role.findById(req.params.id);
      const updatedRole = await role.update(req.body);
      return res.send(updatedRole);
    } catch (error) {
      return res.status(404).send({ error: 'Role does not exist' });
    }
  },

  async deleteRole(req, res) {
    try {
      const role = await Role.findById(req.params.id);
      await role.destroy();
      return res.send({ message: 'Role deleted!' });
    } catch (error) {
      return res.status(404).send({ error: 'Role does not exist' });
    }
  },

  async getRole(req, res) {
    try {
      const role = await Role.findById(req.params.id);
      return res.status(200).send(role);
    } catch (error) {
      return res.status(404).send({ error: 'Role does not exist' });
    }
  },

  async getAllRoles(req, res) {
    try {
      const roles = await Role.findAll();
      return res.send(roles);
    } catch (error) {
      return res.status(404).send({ error: 'No Roles Found' });
    }
  }
};
