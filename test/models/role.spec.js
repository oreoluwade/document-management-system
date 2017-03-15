/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import helper from '../helper';
import model from '../../server/models';

const fakeRole = helper.createRole();

describe('Role Model', () => {
  before(() => model.sequelize.sync({ force: true }));
  describe('Process of creation of a Role', () => {
    let role;
    before((done) => {
      model.Role.create(fakeRole)
        .then((createdRole) => {
          role = createdRole;
          done();
        });
    });
    after(() => model.sequelize.sync({ force: true }));

    it('should be able to create a role', () => {
      expect(role).to.exist;
      expect(typeof role).to.equal('object');
    });

    it('should allow title to be added to role created', () => {
      expect(fakeRole).to.include.keys('title');
      expect(role.title).to.equal(fakeRole.title);
    });
  });

  describe('Role Model Validations', () => {
    after(() => model.sequelize.sync({ force: true }));

    describe('Validation for Title field', () => {
      it('should require a title before a role can be created', (done) => {
        model.Role.create()
          .catch((error) => {
            expect(/notNull Violation/.test(error.message)).to.be.true;
            done();
          });
      });

      it('should ensure that no two roles have the same title', (done) => {
        model.Role.create(fakeRole)
          .then(() => {
            // attempt to create a second role with same title
            model.Role.create(fakeRole)
              .catch((error) => {
                expect(/UniqueConstraintError/.test(error.name)).to.be.true;
                done();
              });
          });
      });
    });
  });
});
