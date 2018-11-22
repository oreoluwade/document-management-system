import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../app';
import models from '../../models';
import resourceCreator from '../resourceCreator';

const request = supertest(app);
const { Role } = models;

const adminUser = resourceCreator.createAdmin();
const regularUser = resourceCreator.createUser();
const firstRole = resourceCreator.createAdminRole();
const secondRole = resourceCreator.createRegularRole();

describe('AUTHORIZATION TEST SUITE', () => {
  let adminToken, regularToken;
  before((done) => {
    Role.bulkCreate([firstRole, secondRole], { returning: true })
      .then(() => {
        request.post('/user/register')
          .send(adminUser)
          .then((response) => {
            adminToken = response.body.token;
            request.post('/user/register')
              .send(regularUser)
              .then((res) => {
                regularToken = res.body.token;
                done();
              });
          })
          .catch((error) => {
            throw new Error(error);
          });
      });
  });

  after(() => models.sequelize.sync({ force: true }));

  it('should not authorize a user who does not have a token set', (done) => {
    request
      .get('/user/all')
      .then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body).to.include.keys('message');
        expect(response.body.message).to.equal('No token provided!');
        done();
      });
  });

  it('should not authorize a user that supplies an invalid token', (done) => {
    request.get('/user/all')
      .set({ Authorization: 'trinity' })
      .then((response) => {
        expect(response.status).to.equal(401);
        expect(response.body).to.include.keys('message');
        expect(response.body.message).to.equal('Invalid token');
        done();
      });
  });

  it('Should not permit fetching of all users for a non-admin user', (done) => {
    request
      .get('/user/all')
      .set({ Authorization: regularToken })
      .expect(403)
      .then((response) => {
        expect(response.body).to.include.keys('message');
        expect(response.body.message).to.equal('Unauthorized');
        done();
      });
  });

  it('Should return all users when a valid admin token is supplied', (done) => {
    request
      .get('/user/all')
      .set({ Authorization: adminToken })
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).to.equal(true);
        expect(response.body.length).to.be.greaterThan(0);
        expect(response.body.length).to.equal(2);
        expect(response.body[0].userName).to.equal(adminUser.userName);
        done();
      });
  });
});
