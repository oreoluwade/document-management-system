const expect = require('chai').expect;
const fakeRole = require('../helper').createRole();
const model = require('../../server/models');

describe('Role Model', () => {
  describe('Create Role', () => {
    let role;
    before((done) => {
      model.Role.create(fakeRole)
        .then((createdRole) => {
          role = createdRole;
          done();
        });
    });
    after(() => model.Role.destroy({ where: {} }));

    it('should be able to create a role', () => {
      expect(role).to.exist;
      expect(typeof role).to.equal('object');
    });

    it('should allow title to be added to role created', () => {
      expect(role.title).to.equal(fakeRole.title);
    });
  });

  describe('Role Model Validations', () => {
    after(() => model.Role.destroy({ where: {} }));

    describe('Validation for Title field', () => {
      it('requires a title before role can be created', (done) => {
        model.Role.create()
          .catch((error) => {
            expect(/not-null constraint/.test(error.message)).to.be.true;
            done();
          });
      });

      it('ensures there are no multiple instances of roles(unique)', (done) => {
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
