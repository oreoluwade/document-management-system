/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import resourceCreator from '../resourceCreator';
import model from '../../models';

const { Role } = model;

const adminRole = resourceCreator.createAdminRole();

describe.only('THE ROLE MODEL TEST SUITE', () => {
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

    it('should allow a creator define the title of the role created', () => {
      expect(role).to.include.keys('title');
      expect(role).to.include.keys('createdAt');
      expect(role).to.include.keys('updatedAt');
      expect(role).to.include.keys('id');
      expect(role.title).to.equal(adminRole.title);
    });
  });

  describe('Role Model Validations', () => {
    after(() => model.sequelize.sync({ force: true }));

    describe('Validation for the title field', () => {
      it('should ensure that a title is given before a role can be created',
        (done) => {
          Role.create()
            .then((result) => {
              console.log('VALIDATION', result)
              // expect(result.message).to.equal('You must supply a valid title');
            })
            .catch((error) => {
              console.log('=========>', error);

              // expect(error.SequelizeValidationError).to.equal('title cannot be null');
              // done();
              done()
            });
        });

      it(`should ensure that it is impossible
      to create two roles with the same title`,
        (done) => {
          Role.create(adminRole)
            .then(() => {
              // attempting to create a second role with the same title as the first
              Role.create(adminRole)
                .then((result) => {
                  console.log('Duplicate Roles', result);
                  expect(result.message).to.equal('Role Already Exists!')
                })
                // .catch((error) => {
                //   expect(/UniqueConstraintError/.test(error.name)).to.be.true;
                //   done();
                // });
            });
            done();
        });
    });
  });
});
