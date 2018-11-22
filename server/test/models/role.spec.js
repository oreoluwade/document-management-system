import { expect } from 'chai';
import Sequelize from 'sequelize';
import resourceCreator from '../resourceCreator';
import model from '../../models';

const { Role } = model;

const adminRole = resourceCreator.createAdminRole();

describe('THE ROLE MODEL TEST SUITE', () => {
  before(() => model.sequelize.sync({ force: true }));
  describe('Creating a new role', () => {
    let role;
    before((done) => {
      Role.create(adminRole)
        .then((createdRole) => {
          role = createdRole;
          done();
        });
    });

    after(() => model.sequelize.sync({ force: true }));

    it('Should allow the creation of a role', () => {
      expect(role).to.exist;
      expect(typeof role).to.equal('object');
    });

    it('should allow creation of a role once title is defined', () => {
      expect(role.dataValues).to.include.keys('title');
      expect(role.dataValues).to.include.keys('createdAt');
      expect(role.dataValues).to.include.keys('updatedAt');
      expect(role.dataValues).to.include.keys('id');
      expect(role.dataValues.title).to.equal(adminRole.title);
    });
  });

  describe('Role Model Validations', () => {
    after(() => model.sequelize.sync({ force: true }));

    describe('Validation for the title field', () => {
      it('should ensure that title cannot be null', (done) => {
        Role.create()
          .catch((error) => {
            expect(error instanceof Sequelize.ValidationError).to.be.true;
            expect(error.errors[0].message).to.equal('Role.title cannot be null');
            done()
          });
      });

      it('should prevent the creation of two roles with the same title', (done) => {
        Role.create(adminRole)
          .then(() => {
            Role.create(adminRole)
              .catch(err => {
                expect(err instanceof Sequelize.UniqueConstraintError).to.be.true;
                expect(err.errors[0].message).to.equal('title must be unique');
                done();
              });
          })
      });
    });
  });
});
