import app from '../../app';
import model from '../../models';
import MockedResources from '../mockedResources';

const request = require('supertest')(app);

const adminUser = MockedResources.createAdmin();
const regularUser = MockedResources.createUser();
const firstRole = MockedResources.createAdminRole();
const secondRole = MockedResources.createRegularRole();

const apiBaseUrl = '/api';

describe('AUTHORIZATION', () => {
  let adminToken, adminRole, regularRole, regularToken;
  beforeAll(done => {
    model.Role.bulkCreate([firstRole, secondRole], {
      returning: true
    }).then(async createdRoles => {
      adminRole = createdRoles[0];
      regularRole = createdRoles[1];
      adminUser.roleId = adminRole.id;
      regularUser.roleId = regularRole.id;

      const response = await request.post(`${apiBaseUrl}/user`).send(adminUser);
      adminToken = response.body.token;
      const resp = await request.post(`${apiBaseUrl}/user`).send(regularUser);
      regularToken = resp.body.token;
      done();
    });
  });

  afterAll(() => model.sequelize.sync({ force: true }));

  it('Should not authorize a user who does not have a token set', async done => {
    const response = await request.get('/api/user');
    expect(response.status).toEqual(401);
    expect(JSON.parse(response.error.text).error).toBe('No token provided!');
    done();
  });

  it('Should not authorize a user that has an invalid token', async done => {
    const response = await request
      .get('/api/user')
      .set({ Authorization: 'trinity' });
    expect(response.status).toEqual(401);
    expect(JSON.parse(response.error.text).error).toBe('Token invalid');
    done();
  });

  it('Should authorize only admin for certain requests', async done => {
    const response = await request
      .get('/api/user')
      .set({ Authorization: regularToken });
    expect(response.status).toBe(403);
    expect(JSON.parse(response.error.text).error).toBe('Unauthorized');
    done();
  });

  it('Should authorize a request when proper rights are in token', async done => {
    const response = await request
      .get('/api/user')
      .set({ Authorization: adminToken });
    expect(response.status).toEqual(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].username).toEqual(adminUser.username);
    expect(response.body[1].username).toEqual(regularUser.username);
    done();
  });
});
