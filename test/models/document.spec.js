/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import model from '../../server/models';
import helper from '../helper';

const fakeUser = helper.createUser();
const fakeDocument = helper.createDocument();

const requiredFields = ['title', 'content', 'ownerId', 'access'];

describe('Document Model', () => {
  describe('How Document Model Works', () => {
    let document;
    let owner;

    before((done) => {
      model.Role.create(helper.createRole())
        .then((createdRole) => {
          fakeUser.roleId = createdRole.id;
          return model.User.create(fakeUser);
        })
        .then((createdUser) => {
          owner = createdUser;
          fakeDocument.ownerId = owner.id;
          done();
        });
    });

    beforeEach(() => {
      document = model.Document.build(fakeDocument);
    });

    afterEach(() => model.Document.destroy({ where: {} }));

    after(() => model.sequelize.sync({ force: true }));

    it('should be able to create a document', (done) => {
      document.save()
        .then((createdDocument) => {
          expect(createdDocument).to.exist;
          expect(typeof createdDocument).to.equal('object');
          done();
        });
    });
    it('should create a document with title and content', (done) => {
      document.save()
        .then((createdDocument) => {
          expect(createdDocument.title).to.equal(fakeDocument.title);
          expect(createdDocument.content).to.equal(fakeDocument.content);
          done();
        });
    });
    it('should create a document with correct OwnerId', (done) => {
      document.save()
        .then((createdDocument) => {
          expect(createdDocument.ownerId).to.equal(owner.id);
          done();
        });
    });
    it('should create a document with publish date', (done) => {
      document.save()
      .then((createdDocument) => {
        expect(createdDocument.createdAt).to.exist;
        done();
      });
    });
    it('should create a document with access set to public', (done) => {
      document.save()
        .then((createdDocument) => {
          expect(createdDocument.access).to.equal('public');
          done();
        });
    });

    describe('Document Model Validations', () => {
      describe('Required Fields Validation', () => {
        requiredFields.forEach((field) => {
          it(`requires a ${field} field to create a document`, () => {
            document[field] = null;
            return document.save()
              .catch((error) => {
                expect(/notNull Violation/.test(error.message)).to.be.true;
              });
          });
        });
      });
    });
  });
});
