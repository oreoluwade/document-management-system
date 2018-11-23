import { expect } from 'chai';
import { ValidationError } from 'sequelize';
import model from '../../models';
import resourceCreator from '../resourceCreator';

const { Role, User, Document } = model;

const adminUser = resourceCreator.createAdmin();
const sampleDocument = resourceCreator.createPublicDocument();

const requiredFields = ['title', 'content', 'access'];

describe('THE DOCUMENT MODEL TEST SUITE', () => {
  describe('The Document Model', () => {
    let document;
    let owner;

    before((done) => {
      Role.create(resourceCreator.createAdminRole())
        .then(() => {
          User.create(adminUser)
            .then((createdUser) => {
              owner = createdUser;
              sampleDocument.ownerId = owner.id;
              done();
            });
        });
    });

    beforeEach(() => {
      document = Document.build(sampleDocument);
    });

    afterEach(() => Document.destroy({ where: {} }));

    after(() => model.sequelize.sync({ force: true }));

    it('should allow a document be created', (done) => {
      document
        .save()
        .then((createdDocument) => {
          expect(createdDocument.dataValues).to.include.keys('title');
          done();
        });
    });

    it('should create a document that has both title and content', (done) => {
      document
        .save()
        .then((createdDocument) => {
          expect(createdDocument.title).to.equal(sampleDocument.title);
          expect(createdDocument.content).to.equal(sampleDocument.content);
          done();
        });
    });

    it('should note the time the document was created', (done) => {
      document.save()
        .then((createdDocument) => {
          expect(createdDocument.dataValues).to.include.keys('createdAt');
          done();
        });
    });

    it('should have the access privilege of a created document specified',
      (done) => {
        document.save()
          .then((createdDocument) => {
            expect(createdDocument.dataValues).to.include.keys('access');
            done();
          });
      });

    describe('Document Model Validations', () => {
      describe('Validate required fields for document creation', () => {
        requiredFields.forEach((field) => {
          it(`requires ${field} field to create a document`, (done) => {
            document[field] = null;
            return document.save()
              .catch((error) => {
                expect(error instanceof ValidationError).to.equal(true);
                expect(error.errors[0].message).to.equal(`Document.${field} cannot be null`);
                done();
              });
          });
        });
      });
    });
  });
});
