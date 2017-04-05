/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../app';
import models from '../../models';
import helper from '../helper';

const request = supertest(app);

const Role = models.Role;
const User = models.User;

const firstRole = helper.createAdminRole();
const fakeUser = helper.createUser();

describe('User API', () => {
  let user;
  let token;

  before(() => Role.create(firstRole)
    .then((createdRole) => {
      fakeUser.roleId = createdRole.id;
    }));

  afterEach(() => User.destroy({ where: {} }));

  after(() => models.sequelize.sync({ force: true }));

  describe('REQUESTS', () => {
    beforeEach((done) => {
      request.post('/user')
        .send(fakeUser)
        .end((error, response) => {
          user = response.body.user;
          token = response.body.token;
          done();
        });
    });

    it('should not allow creation of two users with the same email', (done) => {
      request.post('/user').send(fakeUser).expect(409);
      done();
    });

    describe('GET: (/user) - GET USERS', () => {
      it('should not allow authorization of a user without a token', (done) => {
        request.get('/user')
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });

      it('should not authorize a user with an invalid token', (done) => {
        request.get('/user')
          .set({ Authorization: 'incredibleHawk' })
          .end((error, response) => {
            expect(response.status).to.equal(401);
            done();
          });
      });

      it('should fetch all users when valid token & access are provided',
        (done) => {
          request.get('/user')
            .set({ Authorization: token })
            .end((error, response) => {
              expect(response.status).to.equal(200);
              done();
            });
        });
    });

    describe('GET: (/user/:id) - GET A USER', () => {
      it('should not return a user if the user id is invalid', (done) => {
        request.get('/user/666')
          .set({ Authorization: token })
          .expect(404, done);
      });
      it('should return the user that has the supplied id', (done) => {
        request.get(`/user/${user.id}`)
          .set({ Authorization: token })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(user.email).to.equal(fakeUser.email);
            done();
          });
      });
    });

    describe('PUT: (/user/:id) - UPDATE', () => {
      it('should not allow update of a user if the provided id is invalid',
        (done) => {
          request.get('/user/666')
            .set({ Authorization: token })
            .expect(404, done);
        });
      it('should update a user if the provided id is valid', (done) => {
        const fieldToUpdate = {
          userName: 'nicodemus',
        };

        request.put(`/user/${user.id}`)
          .set({ Authorization: token })
          .send(fieldToUpdate)
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.user.userName)
              .to.equal(fieldToUpdate.userName);
            done();
          });
      });
    });

    describe('DELETE: (/user/:id) - DELETE A USER', () => {
      it('should not allow a delete action if the provided id is invalid',
        (done) => {
          request.get('/user/666')
            .set({ Authorization: token })
            .expect(404, done);
        });
      it('should succesfully delete a user if a valid id is provided',
        (done) => {
          request.delete(`/user/${user.id}`)
            .set({ Authorization: token })
            .end((error, response) => {
              expect(response.status).to.equal(200);
              expect(response.body.message).to.exist;
              expect(response.body.message).to.equal('User Removed');
              done();
            });
        });
    });

    describe('POST: (/user/login) - LOGIN', () => {
      it('should not allow login when invalid identifier(userName/email) or password are inputed',
        (done) => {
          request.post('/user/login')
            .send({
              email: 'dfrksaty@brokenbottle.com',
              password: 'klatdycznmsioep'
            })
            .end((error, response) => {
              expect(response.status).to.equal(401);
              expect(response.body.token).to.not.exist;
              done();
            });
        });
      it('should allow login when valid credentials are supplied',
        (done) => {
          const { email: identifier, password } = fakeUser;
          request.post('/user/login')
            .send({ identifier, password })
            .end((error, response) => {
              expect(response.status).to.equal(200);
              expect(response.body.token).to.exist;
              expect(response.body.message).to.equal('Login Successful! Token expires in one day.');
              done();
            });
        });
    });

    describe('POST: (/user/logout) - LOGOUT', () => {
      it('should successfully logout a recognized user', (done) => {
        request.post('/user/logout')
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.exist;
            expect(response.body.message).to.equal('User Successfully logged out!');
            done();
          });
      });
    });
  });
});
