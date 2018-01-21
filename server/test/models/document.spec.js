/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import model from '../../models';
import helper from '../helper';

const { Role, User, Document } = model;

const fakeUser = helper.createUser();
const fakeDocument = helper.createDocument();

const requiredFields = ['title', 'content', 'access'];

describe('The Document Model Test Suite', () => {
  describe('The Document Model', () => {
    let documents;
    let owner;

    before((done) => {
      Role.create(helper.createAdminRole())
        .then((createdRole) => {
          fakeUser.roleId = createdRole.id;
          return User.create(fakeUser);
          done();
        })
        .then((createdUser) => {
          owner = createdUser;
          fakeDocument.ownerId = owner.id;
          done();
        });
    });

    beforeEach((done) => {
      documents = Document.build(fakeDocument);
      done()
    });

    afterEach(() => Document.destroy({ where: {} }));

    after(() => model.sequelize.sync({ force: true }));

    it('should allow a document be created', (done) => {
      documents.save()
        .then((createdDocument) => {
          expect(createdDocument).to.exist;
          expect(typeof createdDocument).to.equal('object');
          done();
        });
    });

    it('should create a document that has both title and content', (done) => {
      documents.save()
        .then((createdDocument) => {
          expect(createdDocument.title).to.equal(fakeDocument.title);
          expect(createdDocument.content).to.equal(fakeDocument.content);
          done();
        });
    });

    it('should note the time the document was created', (done) => {
      documents.save()
        .then((createdDocument) => {
          expect(createdDocument.createdAt).to.exist;
          done();
        });
    });

    it('should have the access privilege of a created document specified',
      (done) => {
        documents.save()
          .then((createdDocument) => {
            expect(createdDocument.access).to.equal('public');
            done();
          });
      });

    describe('Document Model Validations', () => {
      describe(`The validation of the required fields for document
      creation`, () => {
        requiredFields.forEach((field) => {
          it(`requires a ${field} field to create a document`, () => {
            documents[field] = null;
            return documents.save()
              .catch((error) => {
                expect(/notNull Violation/.test(error.message)).to.be.true;
              });
          });
        });
      });
    });
  });
});
