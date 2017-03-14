/* eslint-disable no-unused-expressions */

const expect = require('chai').expect;
const model = require('../../server/models');
const helper = require('../helper');

const fakeRole = helper.createRole();
const fakeUser = helper.createUser();

const requiredFields = ['userName', 'firstName', 'lastName', 'email',
  'password', 'roleId'];
const uniqueFields = ['userName', 'email'];

describe('USER MODEL', () => {
  before((done) => {
    model.sequelize.sync({ force: true })
      .then(() => {
        done();
      });
  });
  describe('HOW THE USER MODEL WORKS', () => {
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
      model.Role.destroy({ where: {} })
        .then(() => {
          done();
        });
    });

    it('should be able to create a user', () => {
      expect(user).to.exist;
      expect(typeof user).to.equal('object');
    });
    it('should allow a user to have userName, firstName and lastName', () => {
      expect(user.userName).to.equal(fakeUser.userName);
      expect(user.firstName).to.equal(fakeUser.firstName);
      expect(user.lastName).to.equal(fakeUser.lastName);
    });
    it('should allow a user have a valid email address', () => {
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

    it('should be able to update a user', (done) => {
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

    describe('REQUIRED FIELDS', () => {
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
            console.log('This is the last error', error);
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
