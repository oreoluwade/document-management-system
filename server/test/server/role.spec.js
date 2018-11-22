import { expect } from 'chai';
import app from '../../app';
import models from '../../models';
import resourceCreator from '../resourceCreator';

const request = require('supertest')(app);

const { Role } = models;

const adminParams = resourceCreator.createAdmin();
const adminRoleParams = resourceCreator.createAdminRole();
const regularRoleParams = resourceCreator.createRegularRole();

describe('THE ROLE API', () => {
  let token;

  before((done) => {
    models.sequelize.sync({ force: true })
      .then(() => {
        Role.create(adminRoleParams)
          .then(() => {
            request.post('/user/register')
              .send(adminParams)
              .then((response) => {
                token = response.body.token;
                expect(response.status).to.equal(201);
                done();
              });
          });
      });
  });

  describe('Role Requests', () => {
    describe('POST REQUEST: /role', () => {
      it('Should create a role when required params are provided', (done) => {
        const newRole = { title: 'almighty admin' };
        request.post('/role')
          .set({ Authorization: token })
          .send(newRole)
          .then((response) => {
            expect(response.status).to.equal(201);
            expect(response.body.title).to.equal(newRole.title);
            done();
          });
      });

      it('should not create a role when title is not supplied', (done) => {
        const newRole = { name: 'guest' };
        request.post('/role')
          .set({ Authorization: token })
          .send(newRole)
          .expect(400)
          .then((response) => {
            expect(response.body.message).to.equal('You must supply a valid title');
            done();
          });
      });

      it('should not create a role if the role already exists', (done) => {
        Role.create(regularRoleParams)
          .then(() => {
            request.post('/role')
              .set({ Authorization: token })
              .send(regularRoleParams)
              .expect(409)
              .then((response) => {
                expect(response.body.message).to.equal('Role Already Exists!');
                done();
              });
          });
      });
    });

    describe('GET REQUEST: /role', () => {
      it('should not return roles when no token is provided', (done) => {
        request
          .get('/role')
          .expect(401)
          .then((response) => {
            expect(response.body.message).to.equal('No token provided!');
            done();
          });
      });

      it('should not return roles when the token provided is invalid', (done) => {
        request.get('/role')
          .set({ Authorization: 'invalidToken' })
          .expect(401)
          .then((response) => {
            expect(response.body.message).to.equal('Invalid token');
            done();
          });
      });

      it('should return the roles when the requester\'s token is valid', (done) => {
        request.get('/role')
          .set({ Authorization: token })
          .then((response) => {
            expect(response.status).to.equal(200);
            // eslint-disable-next-line no-unused-expressions
            expect(Array.isArray(response.body)).to.be.true;
            expect(response.body.length).to.be.greaterThan(0);
            expect(response.body[0].title).to.equal('admin');
            done();
          });
      });
    });

    describe('GET REQUEST: /role/:id', () => {
      it('should not return any role when the ID supplied is invalid', (done) => {
        request.get('/role/999999')
          .set({ Authorization: token })
          .then((response) => {
            expect(response.status).to.equal(404);
            expect(response.body.message).to.equal('No role with id: 999999');
            done();
          });
      });

      it('should return the role requested when a valid ID is provided', (done) => {
        request.get('/role/1')
          .set({ Authorization: token })
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.title).to.equal('admin');
            done();
          });
      });
    });

    describe('PUT REQUEST /role/:id', () => {
      it('should not update the role if a wrong ID is supplied', (done) => {
        const fieldsToUpdate = { title: 'occasional user' };
        request.put('/role/999999')
          .set({ Authorization: token })
          .send(fieldsToUpdate)
          .then((response) => {
            expect(response.status).to.equal(404);
            expect(response.body.message).to.equal('No role with id: 999999');
            done();
          });
      });

      it('should allow update of the role when the ID is valid', (done) => {
        const fieldsToUpdate = { title: 'observer' };
        request.put('/role/2')
          .set({ Authorization: token })
          .send(fieldsToUpdate)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.title).to.equal(fieldsToUpdate.title);
            done();
          });
      });

      it('Do nothing if the title remains the same for the same role', (done) => {
        const fieldsToUpdate = { title: 'observer' };
        request.put('/role/2')
          .set({ Authorization: token })
          .send(fieldsToUpdate)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.title).to.equal('observer');
            done();
          });
      });

      it('should prevent update when a role with a similar name already exists', (done) => {
        const fieldsToUpdate = { title: 'observer' };
        request.put('/role/3')
          .set({ Authorization: token })
          .send(fieldsToUpdate)
          .then((response) => {
            expect(response.status).to.equal(409);
            expect(response.body.message).to.equal('Role already exists');
            done();
          });
      });
    });

    describe('DELETE REQUEST: /role:id', () => {
      it('should not delete a role when an invalid roleId is supplied', (done) => {
        request.delete('/role/999999')
          .set({ Authorization: token })
          .expect(404)
          .then((response) => {
            expect(response.status).to.equal(404);
            expect(response.body.message).to.equal('No role with id: 999999');
            done();
          });
      });

      it('should delete a role when valid ID is provided', (done) => {
        request.delete('/role/3')
          .set({ Authorization: token })
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.message).to.equal('Role Successfully Deleted');
            done();
          });
      });
    });
  });
});

