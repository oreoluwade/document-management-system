/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../app';
import models from '../../models';
import resourceCreator from '../resourceCreator';

const request = supertest(app);

const { Role } = models;

const sampleAdminRole = resourceCreator.createAdminRole();
const sampleRegularRole = resourceCreator.createRegularRole();
const sampleRegularUser = resourceCreator.createUser();
const sampleAdminUser = resourceCreator.createAdmin();

describe('THE USER API', () => {
  let user;
  let token;
  let dbAdmin;
  let dbAdminToken;

  before((done) => {
    Role.bulkCreate([sampleAdminRole, sampleRegularRole], { returning: true })
    .then(() => {
      request
        .post('/user/register')
        .send(sampleAdminUser)
        .then((response) => {
          dbAdmin = response.body;
          dbAdminToken = response.body.token;
          request.post('/user/register')
          .send(sampleRegularUser)
          .then((res) => {
            user = res.body;
            token = res.body.token;
            done();
          });
        });
    });
  });

  after(() => models.sequelize.sync({ force: true }));

  describe('USER API', () => {
    describe('GET A SINGLE USER: /user/:id', () => {
      it('Should return a 404 status if the user does not exist', (done) => {
        request
          .get('/user/666')
          .set({ Authorization: token })
          .expect(404)
          .then(response => {
            expect(response.body.message).to.equal('No user with ID: 666');
            done();
          });
      });

      it('Should return the user that owns the supplied id', (done) => {
        request
          .get(`/user/${user.id}`)
          .set({ Authorization: token })
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.email).to.equal(sampleRegularUser.email);
            done();
          });
      });
    });

    describe('PUT REQUESTS: /user/:id', () => {
      it('should not allow user update if the provided ID is invalid', (done) => {
        request.get('/user/666')
          .set({ Authorization: token })
          .expect(404)
          .then(response => {
            expect(response.body.message).to.equal('No user with ID: 666');
            done();
          });
      });

      it('Should update a user if the provided ID is valid', (done) => {
        const updateObject = { userName: 'nicodemus' };
        request
          .put(`/user/${user.id}`)
          .set({ Authorization: token })
          .send(updateObject)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.userName).to.equal(updateObject.userName);
            done();
          });
      });
    });

    describe('DELETE REQUESTS: /user/:id', () => {
      it('should not allow a delete action if the provided id is invalid', (done) => {
        request
          .get('/user/666')
          .set({ Authorization: dbAdminToken })
          .expect(404)
          .then(response => {
            expect(response.body.message).to.equal('No user with ID: 666');
            done();
          });
      });

      it('Should prevent deletion of an admin user', (done) => {
        request.delete(`/user/${dbAdmin.id}`)
          .set({ Authorization: dbAdminToken })
          .then((response) => {
            expect(response.status).to.equal(403);
            expect(response.body.message).to.equal('You cannot delete an admin');
            done();
          });
      });

      it('Should prevent a non-admin from deleting a user', (done) => {
        request
          .delete(`/user/${user.id}`)
          .set({ Authorization: token })
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body.message).to.equal('Only an admin can delete a user');
            done();
          });
      });

      it('Should allow an admin delete a user', (done) => {
        request.delete(`/user/${user.id}`)
          .set({ Authorization: dbAdminToken })
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('User Deleted');
            done();
          });
      });
    });

    describe('LOGIN: /user/login', () => {
      it('Authenticate a user when valid parameters are supplied', (done) => {
        request
          .post('/user/login')
          .send({
            identifier: dbAdmin.email,
            password: sampleAdminUser.password
          })
          .then((response) => {
            expect(response.body).to.include.keys('token');
            expect(typeof response.body.token).to.equal('string');
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Login Successful! Token expires in one day.');
            done();
          });
      });

      it('Prevent login when invalid credentials are supplied', (done) => {
        const invalidCredentials = {
          identifier: dbAdmin.email,
          password: 'aristotle'
        }
        request.post('/user/login')
          .send(invalidCredentials)
          .then((response) => {
            expect(response.status).to.equal(401);
            expect(response.body.token).to.not.exist;
            expect(response.body.message).to.equal('Invalid Credentials');
            done();
          });
      });
    });

    describe('LOGOUT: /user/logout', () => {
      it('should successfully logout a recognized user', (done) => {
        request
          .delete('/user/logout')
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Logout successful');
            done();
          });
      });
    });
  });
});
