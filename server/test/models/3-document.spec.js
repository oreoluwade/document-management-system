import model from '../../models';
import MockedResources from '../mockedResources';

const { Role, User, Document } = model;

const generatedUser = MockedResources.createUser();
const generatedDocument = MockedResources.createDocument();

const requiredFields = ['title', 'content', 'access'];

describe('DOCUMENT MODEL', () => {
  afterAll(() => model.sequelize.sync({ force: true }));

  describe('The Document Model', () => {
    let document;
    let owner;

    beforeAll(async done => {
      const role = await Role.create(MockedResources.createAdminRole());
      generatedUser.roleId = role.id;
      owner = await User.create(generatedUser);
      generatedDocument.ownerId = owner.id;
      done();
    });

    beforeEach(() => {
      document = Document.build(generatedDocument);
    });

    afterEach(() => Document.destroy({ where: {} }));

    afterAll(() => model.sequelize.sync({ force: true }));

    it('Should allow a document be successfully created', async done => {
      const createdDocument = await document.save();
      expect(createdDocument).toBeDefined();
      done();
    });

    it('Should create a document that has both title and content', async done => {
      const createdDocument = await document.save();
      expect(createdDocument.title).toBe(generatedDocument.title);
      expect(createdDocument.content).toBe(generatedDocument.content);
      done();
    });

    it('Should supply timestamps to the created document', async done => {
      const createdDocument = await document.save();
      expect(createdDocument).toHaveProperty('createdAt');
      done();
    });

    it('Should have the access privilege of a created document specified', async done => {
      const createdDocument = await document.save();
      expect(createdDocument.access).toEqual('public');
      done();
    });

    describe('Document Model Validations', () => {
      describe(`The validation of the required fields for document
        creation`, () => {
        requiredFields.forEach(field => {
          it(`requires a ${field} field to create a document`, async done => {
            document[field] = null;
            try {
              await document.save();
            } catch (error) {
              expect(error.name).toBe('SequelizeValidationError');
              expect(error.errors[0].message).toBe(
                `Document.${field} cannot be null`
              );
            }
            done();
          });
        });
      });
    });
  });
});
