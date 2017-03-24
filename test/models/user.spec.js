/* eslint-disable no-unused-expressions */

import { expect } from 'chai';
import model from '../../server/models';
import helper from '../helper';

const Role = model.Role;
const User = model.User;

const fakeRole = helper.createAdminRole();
const fakeUser = helper.createUser();

const requiredParams = ['userName', 'firstName', 'lastName', 'email',
  'password', 'roleId'];

const uniqueParams = ['userName', 'email'];

describe('The User Model Test Suite', () => {
  before((done) => {
    model.sequelize.sync({ force: true })
      .then(() => {
        done();
      });
  });

  describe('The Process of creation of a User', () => {
    let user;
    before((done) => {
      Role.create(fakeRole)
        .then((createdRole) => {
          fakeUser.roleId = createdRole.id;
          return User.create(fakeUser);
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

    it('should allow the creation of a user', () => {
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

    it('should ensure that a created user has a valid email address', () => {
      expect(user.email).to.equal(fakeUser.email);
    });

    it('should hash the password of the created user', () => {
      expect(user.password).to.not.equal(fakeUser.password);
    });

    it('should ensure that a created user has a defined role', () =>
      User.findById(user.id, { include: [Role] })
        .then((createdUser) => {
          expect(createdUser.Role.title).to.equal(fakeRole.title);
        }));

    it('should allow for the updating of the details of a user', (done) => {
      User.findById(user.id)
        .then(createdUser => createdUser.update({ userName: 'oreoluwade' }))
        .then((updatedUser) => {
          expect(updatedUser.userName).to.equal('oreoluwade');
          done();
        });
    });
  });

  describe('The working of the Validation of the User model', () => {
    let user;
    beforeEach((done) => {
      Role.create(fakeRole)
        .then((role) => {
          fakeUser.roleId = role.id;
          user = User.build(fakeUser);
          done();
        });
    });

    afterEach((done) => {
      model.sequelize.sync({ force: true })
        .then(() => done());
    });

    describe('the fields necessary before a user can be created', () => {
      requiredParams.forEach((field) => {
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

    describe('Fields that have to be unique in the creation of users', () => {
      uniqueParams.forEach((field) => {
        it(`requires ${field} field to be Unique`, () => {
          user.save()
            .then((firstUser) => {
              fakeUser.roleId = firstUser.roleId;
              // attempt to create another user with same parameters
              return User.build(fakeUser).save();
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
      it('should be valid when passed into the password validation function',
        () => user.save()
          .then((createdUser) => {
            expect(createdUser.validPassword(fakeUser.password)).to.be.true;
          }));
    });
  });
});
