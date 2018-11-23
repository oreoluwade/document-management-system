/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../app';
import models from '../../models';
import resourceCreator from '../resourceCreator';

const request = supertest(app);

const { Document, Role } = models;

const adminRoleParams = resourceCreator.createAdminRole();
const regularRoleParams = resourceCreator.createRegularRole();
const adminUserParams = resourceCreator.createAdmin();
const regularUserParams = resourceCreator.createUser();
const randomUserParams = resourceCreator.createUser();
const publicDocumentParams = resourceCreator.createPublicDocument();
const documentsBundleParams = resourceCreator.documentsBundle();


describe('THE DOCUMENT API TEST SUITE', () => {
  let adminRole, regularRole, adminUser, regularUser, randomUser, adminToken,
    regularToken, publicDocument;

  before((done) => {
    Role.bulkCreate([adminRoleParams, regularRoleParams], { returning: true })
      .then((createdRoles) => {
        adminRole = createdRoles[0];
        regularRole = createdRoles[1];
        adminUserParams.roleId = adminRole.id;
        // Create one admin user and two regular users
        // The users have ids in the order in which they are created
        request.post('/user/register')
          .send(adminUserParams)
          .then((response) => {
            adminUser = response.body;
            adminToken = response.body.token;

            request.post('/user/register')
              .send(regularUserParams)
              .then((res) => {
                regularUser = res.body;
                regularToken = res.body.token;

                request.post('/user/register')
                  .send(randomUserParams)
                  .then((result) => {
                    randomUser = result.body;
                    done();
                  });
              });
          });
      });
  });

  after(() => models.sequelize.sync({ force: true }));

  it('should correctly create test roles & users', (done) => {
    expect(adminRole.title).to.equal(adminRoleParams.title);
    expect(regularRole.title).to.equal(regularRoleParams.title);
    expect(adminUser.email).to.equal(adminUserParams.email);
    expect(regularUser.email).to.equal(regularUserParams.email);
    expect(adminUser.id).to.equal(1);
    expect(regularUser.id).to.equal(2);
    expect(randomUser.id).to.equal(3);
    done();
  });

  describe('DOCUMENT REQUESTS', () => {
    afterEach(() => Document.destroy({ where: {} }));

    describe('CREATE DOCUMENTS: /document/add', () => {
      it('should create a document for a validated user', (done) => {
        publicDocumentParams.ownerId = adminUser.id;
        request
          .post('/document/add')
          .set({ Authorization: adminToken })
          .send(publicDocumentParams)
          .then((response) => {
            expect(response.status).to.equal(201);
            expect(response.body.title).to.equal(publicDocumentParams.title);
            expect(response.body.content).to.equal(publicDocumentParams.content);
            done();
          });
      });

      it('Should not create a document when any required field is not supplied', (done) => {
        const titleObject = { title: 'Only title supplied' };
        request
          .post('/document/add')
          .set({ Authorization: adminToken })
          .send(titleObject)
          .then((response) => {
            expect(response.status).to.equal(403);
            expect(Array.isArray(response.body.message)).to.be.true;
            expect(response.body.message[0]).to.equal('content is required');
            done();
          });
      });

      it('Should not create a document when any required field is empty', (done) => {
        const emptyTitleAndContent = { title: '', content: '', };
        request
          .post('/document/add')
          .set({ Authorization: adminToken })
          .send(emptyTitleAndContent)
          .then((response) => {
            expect(response.status).to.equal(403);
            expect(Array.isArray(response.body.message)).to.be.true;
            expect(response.body.message[0]).to.equal('title cannot be empty');
            expect(response.body.message[1]).to.equal('content cannot be empty');
            done();
          });
      });

      it('Should not create when the creator has a document with the same name', (done) => {
        request
          .post('/document/add')
          .set({ Authorization: adminToken })
          .send(publicDocumentParams)
          .then(() => {
            request
              .post('/document/add')
              .set({ Authorization: adminToken })
              .send(publicDocumentParams)
              .then(response => {
                expect(response.status).to.equal(409);
                expect(response.body.message).to.contain('You already have a document');
                done();
              });
          });
      });
    });

    describe('GET REQUESTS', () => {
      beforeEach((done) => {
        Document.create(publicDocumentParams)
          .then((createdDoc) => {
            publicDocument = createdDoc;
            done();
          });
      });

      describe('GET ALL DOCUMENTS: /document/all', () => {
        it('Should not return any document if no token is provided', (done) => {
          request
            .get('/document/all')
            .expect(401)
            .then(response => {
              expect(response.body.message).to.equal('No token provided!');
              done();
            });
        });

        it('Should not return any document if an invalid token is provided', (done) => {
          request
            .get('/document/all')
            .set({ Authorization: 'invalidToken' })
            .expect(401)
            .then(response => {
              expect(response.body.message).to.equal('Invalid token');
              done();
            });
        });

        it('should return all accesible documents when a valid token is provided', (done) => {
          request
            .get('/document/all')
            .set({ Authorization: adminToken })
            .then(response => {
              expect(response.status).to.equal(200);
              expect(Array.isArray(response.body)).to.be.true;
              expect(response.body.length).to.be.greaterThan(0);
              expect(response.body[0].title).to.equal(publicDocumentParams.title);
              done();
            });
        });
      });

      describe('GET ONE DOCUMENT: /document/:id', () => {
        it('should not return the document if an invalid ID is provided', (done) => {
          request
            .get('/document/789')
            .set({ Authorization: adminToken })
            .expect(404)
            .then(response => {
              expect(response.body.message).to.equal('No document found with ID: 789');
              done();
            });
        });

        it('should return the document when a valid ID is provided', (done) => {
          request
            .get(`/document/${publicDocument.id}`)
            .set({ Authorization: adminToken })
            .then(response => {
              expect(response.status).to.equal(200);
              expect(response.body.title).to.equal(publicDocument.title);
              expect(response.body.content).to.equal(publicDocument.content);
              done();
            });
        });
      });

      describe('UPDATE DOCUMENT: /document/:id', () => {
        it('Should prevent the update of a non-existent document', (done) => {
          const fieldToUpdate = { content: 'Fool\'s errand' };
          request
            .put('/document/9999')
            .set({ Authorization: adminToken })
            .send(fieldToUpdate)
            .then(response => {
              expect(response.status).to.equal(404);
              expect(response.body.message).to.contain('does not exist');
              done();
            });
        });

        it('Should prevent updating another person\'s document', (done) => {
          const fieldToUpdate = { content: 'Fresh replacement content' };
          request
            .put(`/document/${publicDocument.id}`)
            .set({ Authorization: regularToken })
            .send(fieldToUpdate)
            .expect(403)
            .then(response => {
              expect(response.body.message).to.contain('cannot update a document that isn\'t yours');
              done();
            });
        });

        it('Should correctly edit the document if a valid ID is provided', (done) => {
          const fieldToUpdate = { content: 'replace previous document' };
          request.put(`/document/${publicDocument.id}`)
            .set({ Authorization: adminToken })
            .send(fieldToUpdate)
            .then(response => {
              expect(response.status).to.equal(200);
              expect(response.body.content).to.equal(fieldToUpdate.content);
              expect(response.body.message).to.contain('Update Successful!');
              done();
            });
        });
      });

      describe('DELETE DOCUMENT: /document/:id', () => {
        it('Should not allow delete of a document that does not exist', (done) => {
          request
            .delete('/document/9999')
            .set({ Authorization: adminToken })
            .then(response => {
              expect(response.status).to.equal(404);
              expect(response.body.message).to.contain('not found');
              done();
            });
        });

        it('Should not authorize a user to delete documents they did not create', (done) => {
          const fieldToUpdate = { content: 'replace previous document' };
          request
            .delete(`/document/${publicDocument.id}`)
            .set({ Authorization: regularToken })
            .send(fieldToUpdate)
            .then(response => {
              expect(response.status).to.equal(403);
              expect(response.body.message).to.contain('delete a document that does not belong');
              done();
            });
        });

        it('Should allow a user delete a document they created', (done) => {
          request.delete(`/document/${publicDocument.id}`)
            .set({ Authorization: adminToken })
            .then(response => {
              expect(response.status).to.equal(200);
              expect(response.body.message).to.equal('Document successfully deleted');
              done();
            });
        });
      });

      describe('GET DOCUMENTS WITH QUERY OPTIONS', () => {
        beforeEach(() => Document.bulkCreate(documentsBundleParams));

        describe('Document Pagination', () => {
          it('Should allow limiting the result with the limit query parameter', (done) => {
            request
              .get('/document/all?limit=7')
              .set({ Authorization: adminToken })
              .then(response => {
                expect(response.status).to.equal(200);
                expect(Array.isArray(response.body)).to.be.true;
                expect(response.body.length).to.equal(7);
                done();
              });
          });

          it('Should permit ranging the result with the offset query parameter', (done) => {
            request
              .get('/document/all?offset=7')
              .set({ Authorization: adminToken })
              .then(response => {
                expect(response.status).to.equal(200);
                expect(Array.isArray(response.body)).to.be.true;
                expect(response.body.length).to.equal(10);
                done();
              });
          });

          it('Should not return documents if the limit specified is invalid', (done) => {
            request
              .get('/document/all?limit=-1')
              .set({ Authorization: adminToken })
              .expect(400)
              .then(response => {
                expect(response.body.message).to.equal('Limit/Offset must be a positive integer');
                done();
              });
          });

          it('does NOT return documents if the offset specified is invalid', (done) => {
            request
              .get('/document/all?offset=-2')
              .set({ Authorization: adminToken })
              .expect(400)
              .then(response => {
                expect(response.body.message).to.equal('Limit/Offset must be a positive integer');
                done();
              });
          });
        });
      });
    });
  });
});
