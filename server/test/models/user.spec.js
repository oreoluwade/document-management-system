import { expect } from 'chai';
import Sequelize from 'sequelize';
import model from '../../models';
import resourceCreator from '../resourceCreator';

const { Role, User } = model;

const sampleAdminRole = resourceCreator.createAdminRole();
const sampleAdminUser = resourceCreator.createAdmin();
const sampleUser = resourceCreator.createUser();

const requiredUserFields = [
  'userName',
  'firstName',
  'lastName',
  'email',
  'password',
  'roleId'
];

const uniqueUserFields = ['userName', 'email'];

describe('THE USER MODEL TEST SUITE', () => {
  before((done) => {
    model.sequelize.sync({ force: true })
      .then(() => {
        done();
      });
  });

  describe('Creating a User', () => {
    let user;
    before((done) => {
      Role.create(sampleAdminRole)
        .then(() => {
          User.create(sampleAdminUser)
            .then((createdUser) => {
              user = createdUser;
              done();
            });
        })
    });

    after((done) => {
      model.sequelize.sync({ force: true })
        .then(() => done());
    });

    it('should allow the creation of a user', () => {
      expect(user).to.exist;
      expect(typeof user).to.equal('object');
    });

    it('should ensure that a created user has all fields on the User model object', (done) => {
      const userObject = user.dataValues;
      expect(userObject).to.include.keys('userName');
      expect(userObject).to.include.keys('firstName');
      expect(userObject).to.include.keys('lastName');
      expect(userObject).to.include.keys('email');
      expect(userObject).to.include.keys('password');
      expect(userObject).to.include.keys('createdAt');
      expect(userObject).to.include.keys('updatedAt');
      expect(userObject).to.include.keys('roleId');
      expect(userObject).to.include.keys('id');
      done();
    });

    it('should ensure that a created user has a defined role', (done) => {
      User.findByPk(user.id, { include: [Role] })
        .then((foundUser) => {
          expect(foundUser.Role.title).to.equal(sampleAdminRole.title);
        });
      done();
    });

    it('should allow for the update of user details', (done) => {
      User.findByPk(user.id)
        .then(foundUser => foundUser.update({ userName: 'oreoluwade' }))
        .then((updatedUser) => {
          expect(updatedUser.userName).to.equal('oreoluwade');
          done();
        });
    });
  });

  describe('User model validations', () => {
    let user;
    beforeEach((done) => {
      Role.create(sampleAdminRole)
        .then(() => {
          User.build(sampleAdminUser)
            .save()
            .then((createdUser) => {
              user = createdUser;
              done()
            })
        });
    });

    afterEach((done) => {
      model.sequelize.sync({ force: true })
        .then(() => done());
    });

    describe('The required fields for user creation', () => {
      requiredUserFields.forEach((field) => {
        it(`requires ${field} to create a user`, (done) => {
          user[field] = null;
          user.save()
            .catch((error) => {
              expect(error instanceof Sequelize.ValidationError).to.be.true;
              expect(error.errors[0].message).to.equal(`User.${field} cannot be null`)
              done();
            });
        });
      });
    });

    describe('The unique fields for user creation', () => {
      uniqueUserFields.forEach((field) => {
        it(`requires the ${field} field to be Unique`, () => {
          User.build(sampleAdminUser).save()
            .catch((error) => {
              expect(error instanceof Sequelize.UniqueConstraintError).to.be.true;
              expect(error.errors[0].message).to.equal('userName must be unique');
            });
        });
      });
    });

    describe('Email Validation', () => {
      it('should require a properly formatted email', (done) => {
        user.email = 'lagbaja tamedo';
        user.save()
          .catch((error) => {
            expect(error instanceof Sequelize.ValidationError).to.be.true;
            expect(error.errors[0].message).to.equal('Please, provide a valid email address');
            done();
          });
      });
    });

    describe('Password Validation', () => {
      it('Password should be validated with the password validation function', (done) => {
        expect(user.validPassword(sampleAdminUser.password)).to.be.true;
        user.password = 'newPasskey';
        user.save()
          .then((updatedUser) => {
            expect(updatedUser.validPassword('newPasskey')).to.be.true;
          })
        done();
      });
    });
  });
});
