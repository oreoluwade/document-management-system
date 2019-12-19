import models from '../models';

const { Role } = models;

export default {
    async createRole(req, res) {
        const { title } = req.body;
        if (!title.trim().length) {
            return res
                .status(400)
                .send({ error: 'Please provide a valid title' });
        } else {
            try {
                await Role.create({ title: title.trim() });
                return res.status(201).send({ message: 'Success' });
            } catch (error) {
                return res.status(409).send({ error: 'Role already exists!' });
            }
        }
    },

    async updateRole(req, res) {
        const role = await Role.findByPk(req.params.id);
        const updatedRole = await role.update(req.body);
        return res.send(updatedRole);
    },

    async deleteRole(req, res) {
        const role = await Role.findByPk(req.params.id);
        await role.destroy();
        return res.send({ message: 'Role deleted!' });
    },

    async getRole(req, res) {
        const role = await Role.findByPk(req.params.id);
        if (role) {
            return res.send(role);
        } else {
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
