import supertest from 'supertest';
import app from '../../app';
import models from '../../models';
import MockedResources from '../mockedResources';

const request = supertest(app);

const { Role, User, Document } = models;

const adminRoleParams = MockedResources.createAdminRole();
const regularRoleParams = MockedResources.createRegularRole();
const adminUserParams = MockedResources.createAdmin();
const generatedUserOneParams = MockedResources.createUser();
const generatedUserTwoParams = MockedResources.createUser();
const publicDocumentParams = MockedResources.createDocument();
const privateDocumentParams = MockedResources.createPrivateDocument();
const roleDocumentParams = MockedResources.createRoleDocument();
const documentsBundleParams = MockedResources.documentsBundle();

const compareDates = (dateA, dateB) =>
  new Date(dateA).getTime() <= new Date(dateB).getTime();

describe('DOCUMENT REQUESTS', () => {
  let adminRole,
    regularRole,
    adminUser,
    generatedUserOne,
    generatedUserTwo,
    adminToken,
    generatedTokenOne,
    generatedTokenTwo,
    publicDocument,
    privateDocument,
    roleDocument;

  beforeAll(async done => {
    await models.sequelize.sync({ force: true });
    Role.bulkCreate([adminRoleParams, regularRoleParams], {
      returning: true
    }).then(async createdRoles => {
      adminRole = createdRoles[0];
      regularRole = createdRoles[1];
      adminUserParams.roleId = adminRole.id;
      generatedUserOneParams.roleId = regularRole.id;
      generatedUserTwoParams.roleId = regularRole.id;

      const response = await request.post('/api/user').send(adminUserParams);
      adminUser = response.body;
      adminToken = response.body.token;

      const resp = await request.post('/api/user').send(generatedUserOneParams);
      generatedUserOne = resp.body;
      generatedTokenOne = resp.body.token;

      const res = await request.post('/api/user').send(generatedUserTwoParams);
      generatedUserTwo = res.body;
      generatedTokenTwo = res.body.token;
      done();
    });
  });

  afterAll(() => models.sequelize.sync({ force: true }));

  beforeEach(async done => {
    publicDocumentParams.ownerId = adminUser.id;
    publicDocument = await Document.create(publicDocumentParams);
    done();
  });

  afterEach(() => Document.destroy({ where: {} }));

  describe('Create document', () => {
    afterEach(() => Document.destroy({ where: {} }));

    it('Should create a document for a validated user', async done => {
      const payload = {
        title: 'Mercies',
        access: 'public',
        content: 'New mercies I see',
        ownerId: adminUser.id
      };
      const response = await request
        .post('/api/document')
        .set({ Authorization: adminToken })
        .send(payload);
      expect(response.status).toEqual(201);
      expect(response.body.document.title).toEqual(payload.title);
      expect(response.body.document.content).toEqual(payload.content);
      expect(response.body.message).toEqual('Document successfully created!');

      done();
    });

    it('Should prevent creation when required fields not supplied', async done => {
      const incompleteParameters = { title: 'Only title supplied' };
      const response = await request
        .post('/api/document')
        .set({ Authorization: adminToken })
        .send(incompleteParameters);
      expect(response.status).toBe(400);
      const returnedError = JSON.parse(response.body.error);
      expect(returnedError).toContain('content is required');
      expect(returnedError).toContain('access is required');
      done();
    });

    it('Should prevent creation when payload fields are empty', async done => {
      const emptyFieldsPayload = { title: '', content: '', access: '' };
      const response = await request
        .post('/api/document')
        .set({ Authorization: adminToken })
        .send(emptyFieldsPayload);
      expect(response.status).toEqual(400);
      const returnedError = JSON.parse(response.body.error);

      expect(returnedError).toContain('title should not be empty');
      expect(returnedError).toContain('access should not be empty');
      done();
    });
  });

  describe('Get Documents', () => {
    // beforeEach(async done => {
    //   publicDocumentParams.ownerId = adminUser.id;
    //   publicDocument = await Document.create(publicDocumentParams);
    //   done();
    // });

    describe('GET all documents', () => {
      it('should not return any document if no token is provided', async done => {
        const response = await request.get('/api/document');
        expect(response.status).toBe(401);
        done();
      });

      it('should not return any document if invalid token is provided', async done => {
        const response = await request
          .get('/api/document')
          .set({ Authorization: 'songsofsolomon' });
        expect(response.status).toBe(401);
        done();
      });

      it('should return all accesible documents when a valid token is provided', async done => {
        const response = await request
          .get('/api/document')
          .set({ Authorization: adminToken });
        expect(response.status).toEqual(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0].title).toEqual(publicDocumentParams.title);
        done();
      });
    });

    describe('Get one document', () => {
      it('Should not return a document that does not exist', async done => {
        const response = await request
          .get('/api/document/789')
          .set({ Authorization: adminToken });
        expect(response.status).toBe(404);
        done();
      });

      it('Should return the document when a valid ID is provided', async done => {
        const response = await request
          .get(`/api/document/${publicDocument.id}`)
          .set({ Authorization: adminToken });
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(publicDocument.title);
        expect(response.body.content).toEqual(publicDocument.content);
        done();
      });
    });
  });

  describe('Updating a document', () => {
    it('Should prevent update of a nonexistent document', async done => {
      const updatePayload = { content: 'replace previous document' };
      const response = await request
        .put('/api/document/9999')
        .set({ Authorization: adminToken })
        .send(updatePayload);
      expect(response.status).toEqual(404);
      done();
    });

    it('Should not authorize illegal update', async done => {
      const updatePayload = { content: 'replace previous document' };
      const response = await request
        .put(`/api/document/${publicDocument.id}`)
        .set({ Authorization: generatedTokenOne })
        .send(updatePayload);
      expect(response.status).toEqual(401);
      done();
    });

    it('Should correctly update the document if a valid ID is provided', async done => {
      const updatePayload = { content: 'replace previous document' };
      const response = await request
        .put(`/api/document/${publicDocument.id}`)
        .set({ Authorization: adminToken })
        .send(updatePayload);
      expect(response.status).toEqual(200);
      expect(response.body.document.content).toEqual(updatePayload.content);
      expect(response.body.message).toEqual('Update Successful!');
      done();
    });
  });

  describe('Delete a document', () => {
    beforeEach(async done => {
      const payload = {
        title: 'Mercies',
        access: 'public',
        content: 'New mercies I see',
        ownerId: adminUser.id
      };
      await request
        .post('/api/document')
        .set({ Authorization: adminToken })
        .send(payload);
      done();
    });

    afterEach(() => Document.destroy({ where: {} }));

    it('Should not delete a document if an unavailable document ID is provided', async done => {
      const response = await request
        .delete('/api/document/9999')
        .set({ Authorization: adminToken });
      expect(response.status).toEqual(404);
      done();
    });

    it('Should not allow users delete documents they did not create', async done => {
      const response = await request
        .delete(`/api/document/${publicDocument.id}`)
        .set({ Authorization: generatedTokenOne });
      // .send()
      expect(response.status).toEqual(401);
      done();
    });

    it('Should allow successful deletion when a valid id is provided', async done => {
      const response = await request
        .delete(`/api/document/${publicDocument.id}`)
        .set({ Authorization: adminToken });
      expect(response.status).toEqual(200);
      expect(response.body.message).toEqual('Document successfully deleted');
      done();
    });
  });
});
