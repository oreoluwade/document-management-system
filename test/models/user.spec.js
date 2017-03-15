/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import model from '../../server/models';
import helper from '../helper';

const fakeRole = helper.createRole();
const fakeUser = helper.createUser();

const requiredFields = ['userName', 'firstName', 'lastName', 'email',
  'password', 'roleId'];
const uniqueFields = ['userName', 'email'];
describe('User Model', () => {
  before((done) => {
    model.sequelize.sync({ force: true })
      .then(() => {
        done();
      });
  });
  describe('Process of creation of the User', () => {
    let user;
    before((done) => {
      model.Role.create(fakeRole)
        .then((createdRole) => {
          fakeUser.roleId = createdRole.id;
          return model.User.create(fakeUser);
        })
        .then((createdUser) => {
          user = createdUser;
          done();
        });
    });

    after((done) => {
      model.sequelize.sync({ force: true })
        .then(() => {
          done();
        });
    });

    it('should be able to create a user', () => {
      expect(user).to.exist;
      expect(typeof user).to.equal('object');
    });
    it('should ensure that a created user has a userName', () => {
      expect(user.userName).to.equal(fakeUser.userName);
    });
    it('should ensure that a created user has a firstName', () => {
      expect(user.firstName).to.equal(fakeUser.firstName);
    });
    it('should ensure that a created user has a lastName', () => {
      expect(user.lastName).to.equal(fakeUser.lastName);
    });
    it('should ensure that a user has a valid email address', () => {
      expect(user.email).to.equal(fakeUser.email);
    });
    it('should create a user with hashed password', () => {
      expect(user.password).to.not.equal(fakeUser.password);
    });
    it('should create a user with a defined Role', () =>
      model.User.findById(user.id, { include: [model.Role] })
        .then((foundUser) => {
          expect(foundUser.Role.title).to.equal(fakeRole.title);
        }));

    it('should allow updating a user details', (done) => {
      model.User.findById(user.id)
        .then(foundUser => foundUser.update({ userName: 'oreoluwade' }))
        .then((updatedUser) => {
          expect(updatedUser.userName).to.equal('oreoluwade');
          done();
        });
    });
  });

  describe('How User model Validation works', () => {
    let user;
    beforeEach((done) => {
      model.Role.create(fakeRole)
        .then((role) => {
          fakeUser.roleId = role.id;
          user = model.User.build(fakeUser);
          done();
        });
    });

    afterEach((done) => {
      model.sequelize.sync({ force: true })
        .then(() => done());
    });

    describe('the required fields for user creation', () => {
      requiredFields.forEach((field) => {
        it(`requires ${field} to create a user`, (done) => {
          user[field] = null;
          user.save()
            .catch((error) => {
              expect(/notNull Violation/.test(error.message)).to.be.true;
              done();
            });
        });
      });
    });

    describe('Unique Fields', () => {
      uniqueFields.forEach((field) => {
        it(`requires ${field} field to be Unique`, () => {
          user.save()
            .then((firstUser) => {
              fakeUser.roleId = firstUser.roleId;
              // attempt to create another user with same parameters
              return model.User.build(fakeUser).save();
            })
            .catch((error) => {
              expect(/UniqueConstraintError/.test(error.name)).to.be.true;
            });
        });
      });
    });

    describe('Mail Validation', () => {
      it('should require an authentic user email', (done) => {
        user.email = 'lagbaja tamedo';
        user.save()
          .catch((error) => {
            expect(/isEmail failed/.test(error.message)).to.be.true;
            expect(/SequelizeValidationError/.test(error.name)).to.be.true;
            done();
          });
      });
    });

    describe('Password Validation', () => {
      it('should be valid if compared', () => user.save()
        .then((createdUser) => {
          expect(createdUser.validPassword(fakeUser.password)).to.be.true;
        }));
    });
  });
});
