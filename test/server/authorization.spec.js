import { expect } from 'chai';
import app from '../../server';
import model from '../../server/models';
import helper from '../helper';

const request = require('supertest')(app);

const adminUser = helper.createAdmin();
const regularUser = helper.createUser();
const firstRole = helper.createAdminRole();
const secondRole = helper.createRegularRole();

describe('User Authorization', () => {
  let adminToken, adminRole, regularRole, regularToken;
  before((done) => {
    model.Role.bulkCreate([firstRole, secondRole], {
      returning: true
    })
      .then((createdRoles) => {
        adminRole = createdRoles[0];
        regularRole = createdRoles[1];
        adminUser.roleId = adminRole.id;
        regularUser.roleId = regularRole.id;

        request.post('/user')
          .send(adminUser)
          .end((error, response) => {
            adminToken = response.body.userToken;
            request.post('/user')
              .send(regularUser)
              .end((err, res) => {
                regularToken = res.body.userToken;
                done();
              });
          });
      });
  });

  after(() => model.sequelize.sync({ force: true }));

  it('should not authorize a user without a token', (done) => {
    request.get('/user')
      .end((error, response) => {
        expect(response.status).to.equal(401);
        done();
      });
  });
  it('should not authorize a user who supplies invalid token', (done) => {
    request.get('/user')
      .set({ Authorization: 'trinity' })
      .end((error, response) => {
        expect(response.status).to.equal(401);
        done();
      });
  });
  it('should not return users if the user is not admin', (done) => {
    request.get('/user')
      .set({ Authorization: regularToken })
      .expect(403, done);
  });
  it('should correctly return all users with valid token and access',
    (done) => {
      request.get('/user')
        .set({ Authorization: adminToken })
        .end((error, response) => {
          expect(response.status).to.equal(200);
          // eslint-disable-next-line no-unused-expressions
          expect(Array.isArray(response.body.usersFound)).to.be.true;
          expect(response.body.usersFound.length).to.be.greaterThan(0);
          expect(response.body.usersFound[0].userName)
            .to.equal(adminUser.userName);
          done();
        });
    });
});
