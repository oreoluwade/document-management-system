import MockedResources from '../mockedResources';
import model from '../../models';

const { Role } = model;

const adminRole = MockedResources.createAdminRole();

describe('ROLE MODEL', () => {
  afterAll(() => model.sequelize.sync({ force: true }));

  describe('Create a role', () => {
    let role;
    beforeAll(async done => {
      role = await Role.create(adminRole);
      done();
    });

    afterAll(() => model.sequelize.sync({ force: true }));

    it('should allow the creation of a role', () => {
      expect(true).toBe(true);
      expect(role).toBeDefined();
    });

    it('Should allow a creator define the title of the role created', () => {
      expect(role).toHaveProperty('title', 'admin');
    });
  });

  describe('Role Model Validation', () => {
    afterAll(() => model.sequelize.sync({ force: true }));

    it('Should ensure unique roles by title', async done => {
      await Role.create(adminRole);
      try {
        await Role.create(adminRole);
      } catch (error) {
        expect(error.name).toBe('SequelizeUniqueConstraintError');
        expect(error.errors[0].message).toEqual('title must be unique');
      }
      done();
    });
  });
});
