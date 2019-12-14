import model from '../../models';
import MockedResources from '../mockedResources';

const { Role, User } = model;

const adminRole = MockedResources.createAdminRole();
const adminUser = MockedResources.createUser();

const requiredParams = [
  'username',
  'firstname',
  'lastname',
  'email',
  'password',
  'roleId'
];

describe('USER MODEL', () => {
  afterAll(() => model.sequelize.sync({ force: true }));

  describe('Create a User', () => {
    let user;
    beforeAll(async done => {
      const role = await Role.create(adminRole);
      adminUser.roleId = role.id;
      user = await User.create(adminUser);
      done();
    });

    afterAll(() => model.sequelize.sync({ force: true }));

    it('should allow the creation of a user', () => {
      expect(user).toBeDefined();
    });

    it('should ensure that a created user has expected parameters', () => {
      expect(user).toHaveProperty('username', adminUser.username);
      expect(user).toHaveProperty('firstname', adminUser.firstname);
      expect(user).toHaveProperty('lastname', adminUser.lastname);
      expect(user).toHaveProperty('email', adminUser.email);
      expect(user).toHaveProperty('roleId', adminUser.roleId);
    });
  });

  describe('Validation of the User model', () => {
    let user;
    beforeEach(async done => {
      const role = await Role.create(adminRole);
      adminUser.roleId = role.id;
      user = User.build(adminUser);
      done();
    });

    afterEach(() => model.sequelize.sync({ force: true }));

    describe('The fields necessary for user creation', () => {
      requiredParams.forEach(field => {
        it(`Requires ${field} to create a user`, async done => {
          user[field] = null;
          try {
            await user.save();
          } catch (error) {
            expect(error.name).toBe('SequelizeValidationError');
            expect(error.errors[0].message).toBe(
              `User.${field} cannot be null`
            );
          }
          done();
        });
      });
    });

    describe('Unique fields for user creation', () => {
      it('Requires username to be Unique', async done => {
        try {
          await user.save();
          await User.create(adminUser);
        } catch (error) {
          console.log('Error', error.errors[0].message);
          expect(error.name).toBe('SequelizeUniqueConstraintError');
          expect(error.errors[0].message).toBe('username must be unique');
        }
        done();
      });

      it('Requires email to be Unique', async done => {
        try {
          await user.save();
          adminUser.username = 'changedUser';
          await User.create(adminUser);
        } catch (error) {
          expect(error.name).toBe('SequelizeUniqueConstraintError');
          expect(error.errors[0].message).toBe('email must be unique');
        }
        done();
      });
    });

    describe('Mail Validation', () => {
      it('should require a properly formatted email', async done => {
        user.email = 'lagbaja tamedo';
        try {
          await user.save();
        } catch (error) {
          expect(error.name).toBe('SequelizeValidationError');
          expect(error.errors[0].message).toBe(
            'Validation isEmail on email failed'
          );
          done();
        }
      });
    });

    describe('Password Validation', () => {
      it('should be validated with the password validation function', async done => {
        const createdUser = await user.save();
        expect(createdUser.validPassword(adminUser.password)).toBeTruthy();
        done();
      });
    });
  });
});
