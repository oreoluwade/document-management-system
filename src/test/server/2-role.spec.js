import app from '../../app';
import models from '../../models';
import MockedResources from '../mockedResources';

const request = require('supertest')(app);

const { Role } = models;

const adminParams = MockedResources.createAdmin();
const adminRoleParams = MockedResources.createAdminRole();
const regularRoleParams = MockedResources.createRegularRole();

describe('ROLE CONTROLLER', () => {
    let token;
    let role;

    beforeAll(async done => {
        const adminRole = await Role.create(adminRoleParams);
        adminParams.roleId = adminRole.id;
        const response = await request.post('/api/user').send(adminParams);
        token = response.body.token;
        expect(response.status).toEqual(201);
        done();
    });

    beforeEach(async done => {
        const regularRole = await Role.create(regularRoleParams);
        role = regularRole;
        done();
    });

    afterEach(() => Role.destroy({ where: { id: role.id } }));

    afterAll(() => models.sequelize.sync({ force: true }));

    describe('ROLE REQUESTS', () => {
        describe('Create Role', () => {
            it('Should create role when valid title is supplied', async done => {
                const newRolePayload = { title: 'superadmin' };
                const response = await request
                    .post('/api/role')
                    .set({ Authorization: token })
                    .send(newRolePayload);
                expect(response.status).toEqual(201);
                expect(response.body.message).toEqual('Success');
                done();
            });

            it('Should not create a role when title is invalid', async done => {
                const newRolePayload = { title: '' };
                const response = await request
                    .post('/api/role')
                    .set({ Authorization: token })
                    .send(newRolePayload);
                expect(response.status).toEqual(400);
                expect(JSON.parse(response.error.text).error).toBe(
                    'Please provide a valid title'
                );
                done();
            });

            it('Should not create a role if the role already exists', async done => {
                const response = await request
                    .post('/api/role')
                    .set({ Authorization: token })
                    .send(regularRoleParams);
                expect(response.status).toEqual(409);
                expect(JSON.parse(response.error.text).error).toBe(
                    'Role already exists!'
                );
                done();
            });
        });

        describe('Get roles', () => {
            it('Should not return roles when no token is provided', async done => {
                const response = await request.get('/api/role');
                expect(response.status).toEqual(401);
                done();
            });

            it('Should not return roles when the token provided is invalid', async done => {
                const response = await request
                    .get('/api/role')
                    .set({ Authorization: 'invalidToken' });
                expect(response.status).toBe(401);
                done();
            });

            it('Should return roles when request is by admin', async done => {
                const response = await request
                    .get('/api/role')
                    .set({ Authorization: token });
                expect(response.status).toEqual(200);
                expect(Array.isArray(response.body)).toBeTruthy();
                expect(response.body.length).toBeGreaterThan(0);
                done();
            });
        });

        describe('GET role by ID', () => {
            it('Should not return role when ID is invalid', async done => {
                const response = await request
                    .get('/api/role/999999')
                    .set({ Authorization: token });
                expect(response.status).toEqual(404);
                expect(response.body.error).toEqual('Role does not exist');
                done();
            });

            it('Should return the role when the ID is valid', async done => {
                const response = await request
                    .get(`/api/role/${role.id}`)
                    .set({ Authorization: token });
                expect(response.status).toEqual(200);
                done();
            });
        });

        describe('Update Role', () => {
            it('Should not update the role if a wrong ID is supplied', async done => {
                const fieldsToUpdate = { title: 'occasional user' };
                const response = await request
                    .put('/api/role/999999')
                    .set({ Authorization: token })
                    .send(fieldsToUpdate);
                expect(response.status).toBe(404);
                expect(response.body.error).toEqual('Role does not exist');
                done();
            });

            it('Should allow update when the ID is valid', async done => {
                const fieldsToUpdate = { title: 'observer' };
                const response = await request
                    .put(`/api/role/${role.id}`)
                    .set({ Authorization: token })
                    .send(fieldsToUpdate);
                expect(response.status).toEqual(200);
                expect(response.body.title).toEqual(fieldsToUpdate.title);
                done();
            });
        });

        describe('Delete Role', () => {
            it('Should not delete a role when an invalid roleId is supplied', async done => {
                const response = await request
                    .delete('/api/role/999999')
                    .set({ Authorization: token });
                expect(response.status).toBe(404);
                expect(response.body.error).toEqual('Role does not exist');
                done();
            });

            it('Should delete a role when valid ID is provided', async done => {
                const response = await request
                    .delete(`/api/role/${role.id}`)
                    .set({ Authorization: token });
                expect(response.status).toEqual(200);
                expect(response.body.message).toEqual('Role deleted!');
                done();
            });
        });
    });
});
