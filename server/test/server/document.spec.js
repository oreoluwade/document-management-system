/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import supertest from 'supertest';
import app from '../../app';
import models from '../../models';
import helper from '../helper';

const request = supertest(app);

const Document = models.Document;
const User = models.User;
const Role = models.Role;

const adminRoleParams = helper.createAdminRole();
const regularRoleParams = helper.createRegularRole();
const adminUserParams = helper.createAdmin();
const regularUserParams = helper.createUser();
const randomUserParams = helper.createUser();
const publicDocumentParams = helper.createDocument();
const privateDocumentParams = helper.createPrivateDocument();
const roleDocumentParams = helper.createRoleDocument();
const documentsBundleParams = helper.documentsBundle();

const compareDates = (dateA, dateB) =>
  new Date(dateA).getTime() <= new Date(dateB).getTime();

describe('DOCUMENT REQUESTS', () => {
  let adminRole, regularRole, adminUser, privateUser, randomUser, publicToken,
    privateToken, randomToken, publicDocument, privateDocument, roleDocument;

  before((done) => {
    Role.bulkCreate([adminRoleParams, regularRoleParams], {
      returning: true
    })
      .then((createdRoles) => {
        adminRole = createdRoles[0];
        regularRole = createdRoles[1];
        adminUserParams.roleId = adminRole.id;
        // two users allowed to have the same role
        regularUserParams.roleId = regularRole.id;
        randomUserParams.roleId = regularRole.id;
        // Create one admin user and two regular users
        // The users have ids in the order in which they are created
        request.post('/user')
          .send(adminUserParams)
          .end((error, response) => {
            adminUser = response.body.user;
            publicToken = response.body.token;

            request.post('/user')
              .send(regularUserParams)
              .end((err, res) => {
                privateUser = res.body.user;
                privateToken = res.body.token;

                request.post('/user')
                  .send(randomUserParams)
                  .end((err, res) => {
                    randomUser = res.body.user;
                    randomToken = res.body.token;
                    done();
                  });
              });
          });
      });
  });

  after(() => models.sequelize.sync({ force: true }));

  it('should correctly create test roles & users', () => {
    expect(adminRole.title).to.equal(adminRoleParams.title);
    expect(regularRole.title).to.equal(regularRoleParams.title);
    expect(adminUser.email).to.equal(adminUserParams.email);
    expect(privateUser.email).to.equal(regularUserParams.email);
    expect(adminUser.id).to.equal(1);
    expect(privateUser.id).to.equal(2);
    expect(randomUser.id).to.equal(3);
  });

  describe('THE POSSIBLE API REQUESTS', () => {
    // beforeEach((done) => {
    //   publicDocumentParams.ownerId = adminUser.id;
    //   Document.create(publicDocumentParams)
    //     .then((createdPublicDocument) => {
    //       publicDocument = createdPublicDocument;
    //       done();
    //     });
    // });

    afterEach(() => Document.destroy({ where: {} }));

    describe('Creating a document by making a POST request', () => {
      it('should create a document for a validated user', (done) => {
        publicDocumentParams.ownerId = adminUser.id;
        request.post('/document')
          .set({ Authorization: publicToken })
          .send(publicDocumentParams)
          .end((error, response) => {
            expect(response.status).to.equal(201);
            expect(response.body.document.title)
              .to.equal(publicDocumentParams.title);
            expect(response.body.document.content)
              .to.equal(publicDocumentParams.content);
            done();
          });
      });

      it(`should not create a document when all
      required fields are not filled in`,
        (done) => {
          const incompleteParameters = { title: 'Only title supplied' };
          request.post('/document')
            .set({ Authorization: publicToken })
            .send(incompleteParameters)
            .end((error, response) => {
              expect(response.status).to.equal(400);
              expect(response.body.message)
                .to.contain('content cannot be null');
              expect(response.body.message)
                .to.contain('ownerId cannot be null');
              done();
            });
        });

      it(`should not create a document when one or
      more of the required fields are empty`,
        (done) => {
          const emptyString = { title: '', content: '', };
          request.post('/document')
            .set({ Authorization: publicToken })
            .send(emptyString)
            .end((error, response) => {
              expect(response.status).to.equal(400);
              expect(response.body.message)
                .to.contain('You must provide a Title');
              expect(response.body.message)
                .to.contain('You cannot have an empty Document');
              done();
            });
        });
    });

    describe('GET requests for documents', () => {
      beforeEach((done) => {
        publicDocumentParams.ownerId = adminUser.id;
        Document.create(publicDocumentParams)
          .then((createdPublicDocument) => {
            publicDocument = createdPublicDocument;
            done();
          });
      });

      describe('Making a GET request to fetch all documents accessible', () => {
        it('should not return any document if no token is provided', (done) => {
          request.get('/document')
            .expect(401, done);
        });

        it('should not return any document if invalid token is provided',
          (done) => {
            request.get('/document')
              .set({ Authorization: 'songsofsolomon' })
              .expect(401, done);
          });

        it('should return all documents when a valid token is provided',
          (done) => {
            request.get('/document')
              .set({ Authorization: publicToken })
              .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(Array.isArray(response.body)).to.be.true;
                expect(response.body.length).to.be.greaterThan(0);
                expect(response.body[0].title)
                  .to.equal(publicDocumentParams.title);
                done();
              });
          });
      });

      describe('making a GET request to fetch only one document', () => {
        it('should not return a document if an invalid id is provided',
          (done) => {
            request.get('/document/789')
              .set({ Authorization: publicToken })
              .expect(404, done);
          });

        it('should return the document when a valid id is provided',
          (done) => {
            request.get(`/document/${publicDocument.id}`)
              .set({ Authorization: publicToken })
              .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body.title).to.equal(publicDocument.title);
                expect(response.body.content).to.equal(publicDocument.content);
                done();
              });
          });
      });

      describe('making a PUT request to update a document details/content',
        () => {
          it(`should not be possible to edit a document
          if an invalid id of the document is provided`, (done) => {
            const fieldToUpdate = { content: 'replace previous document' };
            request.put('/document/9999')
                .set({ Authorization: publicToken })
                .send(fieldToUpdate)
                .expect(404, done);
          });

          it(`should not be possible for a User that is
          not the document Owner to edit the document`,
            (done) => {
              const fieldToUpdate = { content: 'replace previous document' };
              request.put(`/document/${publicDocument.id}`)
                .set({ Authorization: privateToken })
                .send(fieldToUpdate)
                .expect(403, done);
            });

          it('should correctly edit the document if a valid id is provided',
            (done) => {
              const fieldToUpdate = { content: 'replace previous document' };
              request.put(`/document/${publicDocument.id}`)
                .set({ Authorization: publicToken })
                .send(fieldToUpdate)
                .end((error, response) => {
                  expect(response.status).to.equal(200);
                  expect(response.body.editedDocument.content)
                    .to.equal(fieldToUpdate.content);
                  expect(response.body.message)
                    .to.contain('Update Successful!');
                  done();
                });
            });
        });

      describe('making a DELETE request to delete a document', () => {
        it('should not allow delete if an invalid document id is provided',
          (done) => {
            request.delete('/document/9999')
              .set({ Authorization: publicToken })
              .expect(404, done);
          });

        it('should not allow users delete documents they did not create',
          (done) => {
            const fieldToUpdate = { content: 'replace previous document' };
            request.delete(`/document/${publicDocument.id}`)
              .set({ Authorization: privateToken })
              .send(fieldToUpdate)
              .expect(403, done);
          });

        it('should allow successful deletion when a valid id is provided',
          (done) => {
            request.delete(`/document/${publicDocument.id}`)
              .set({ Authorization: publicToken })
              .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body.message)
                  .to.equal('Document successfully deleted');
                done();
              });
          });
      });
    });

    describe('GET Requests for Documents with Access set to Private', () => {
      describe('As long as the document access is set to private', () => {
        beforeEach((done) => {
          privateDocumentParams.ownerId = privateUser.id;
          Document.create(privateDocumentParams)
            .then((createdDocument) => {
              privateDocument = createdDocument;
              done();
            });
        });

        it('should NOT return the document when the requester is not the owner',
          (done) => {
            request.get(`/document/${privateDocument.id}`)
            .set({ Authorization: publicToken })
            .expect(403, done);
          });

        it(`should NOT return the document EVEN when
        the requester has the same role as the document owner
        but is not the owner`,
          (done) => {
            request.get(`/document/${privateDocument.id}`)
              .set({ Authorization: randomToken })
              .expect(403, done);
          });

        it(`should ONLY return the document if
        the requester is the owner(creator)`,
          (done) => {
            request.get(`/document/${privateDocument.id}`)
              .set({ Authorization: privateToken })
              .end((error, response) => {
                expect(response.status).to.equal(200);
                expect(response.body.title)
                  .to.equal(privateDocumentParams.title);
                expect(response.body.content)
                  .to.equal(privateDocumentParams.content);
                done();
              });
          });
      });
    });

    describe('GET Requests for Documents with Access set to Role', () => {
      describe('When a document with access set to "role" is requested', () => {
        beforeEach((done) => {
          roleDocumentParams.ownerId = randomUser.id;

          Document.create(roleDocumentParams)
            .then((createdDocument) => {
              roleDocument = createdDocument;
              done();
            });
        });

        it(`should ONLY be returned when the requester
        has the same role as the owner`, (done) => {
          request.get(`/document/${roleDocument.id}`)
              .set({ Authorization: privateToken })
              .end((errors, response) => {
                expect(response.status).to.equal(200);
                expect(response.body.title).to.equal(roleDocumentParams.title);
                expect(response.body.content)
                  .to.equal(roleDocumentParams.content);
                done();
              });
        });
      });
    });
  });

  describe('GET Requests to get multiple Documents', () => {
    before(() => Document.bulkCreate(documentsBundleParams));

    describe('Document Pagination', () => {
      it(`should allow the use of the "limit" query
      parameter to limit the results gotten`, (done) => {
        request.get('/document?limit=7')
          .set({ Authorization: publicToken })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.length).to.equal(7);
            done();
          });
      });

      it(`should allow the use of the "offset" query parameter
      to create a range of results gotten`, (done) => {
        request.get('/document?offset=7')
          .set({ Authorization: publicToken })
          .end((error, response) => {
            expect(response.status).to.equal(200);
            expect(response.body.length).to.equal(9);
            done();
          });
      });

      it('should return the documents in the order of their published dates',
        (done) => {
          request.get('/document?limit=7')
          .set({ Authorization: publicToken })
          .end((error, response) => {
            const documents = response.body;

            let flag = false;
            for (let index = 0; index < documents.length - 1; index += 1) {
              flag = compareDates(documents[index].createdAt,
                documents[index + 1].createdAt);
              if (!flag) break;
            }
            expect(flag).to.be.true;
            done();
          });
        });

      it('should NOT return documents if the limit is not valid', (done) => {
        request.get('/document?limit=-1')
          .set({ Authorization: publicToken })
          .expect(400, done);
      });

      it('does NOT return documents if the offset is not valid', (done) => {
        request.get('/document?offset=-2')
          .set({ Authorization: publicToken })
          .expect(400, done);
      });
    });

    describe('making a POST request to search for documents', () => {
      it('should carry out a search and return the correct document',
        (done) => {
          const query = documentsBundleParams[10].content.substr(5, 13);
          const matcher = new RegExp(query);

          request.post(`/document/search?query=${query}`)
            .set({ Authorization: publicToken })
            .end((error, response) => {
              expect(response.status).to.equal(200);
              expect(matcher.test(response.body[0].content)).to.be.true;
              done();
            });
        });

      it(`should allow for the specification of the query params "limit"
      to determine the number of documents to return`,
        (done) => {
          request.post('/document/search?limit=4')
            .set({ Authorization: publicToken })
            .end((error, response) => {
              expect(response.status).to.equal(200);
              expect(response.body.length).to.equal(4);
              done();
            });
        });

      it('should allow the use of query params "offset" to create a range',
        (done) => {
          request.post('/document/search?offset=7')
            .set({ Authorization: publicToken })
            .end((error, response) => {
              expect(response.status).to.equal(200);
              expect(response.body.length).to.equal(9);
              done();
            });
        });

      it('should allow the use of query params "role" to get documents by role',
        (done) => {
          request.post('/document/search?role=1')
            .set({ Authorization: publicToken })
            .end((error, response) => {
              expect(response.status).to.equal(200);
              const query = {
                where: { id: response.body[0].id },
                include: [{
                  model: User,
                  as: 'owner'
                }]
              };

              Document.findAll(query)
                .then((foundDocuments) => {
                  expect(foundDocuments[0].owner.roleId).to.equal(1);
                  done();
                });
            });
        });

      it(`should allow the use of query params "publishedDate" to
      determine the order in which results are returned`,
        (done) => {
          request.post('/document/search?publishedDate=ASC')
            .set({ Authorization: publicToken })
            .end((error, response) => {
              const foundDocuments = response.body;
              let flag = false;
              for (let index = 0; index < foundDocuments.length - 1;
                index += 1) {
                flag = compareDates(foundDocuments[index].createdAt,
                  foundDocuments[index + 1].createdAt);
                if (!flag) break;
              }
              expect(flag).to.be.true;
              done();
            });
        });

      it('should NOT return documents if the limit is not valid', (done) => {
        request.post('/document/search?limit=-1')
          .set({ Authorization: publicToken })
          .expect(400);
        done();
      });

      it('should NOT return documents if the offset is not valid', (done) => {
        request.post('/document/search?offset=-2')
          .set({ Authorization: publicToken })
          .expect(400);
        done();
      });
    });
  });
});