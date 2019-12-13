import { expect } from 'chai';
import MockedResources from '../mockedResources';
import model from '../../models';

const { Role } = model;

const adminRole = MockedResources.createAdminRole();

describe('ROLE MODEL', () => {
    before(() => model.sequelize.sync({ force: true }));
    describe('Create a role', () => {
        let role;
        before(done => {
            Role.create(adminRole).then(createdRole => {
                role = createdRole;
                done();
            });
        });

        after(() => model.sequelize.sync({ force: true }));

        it('should allow the creation of a role', () => {
            expect(role).to.exist;
            expect(typeof role).to.equal('object');
        });

        it('Should allow a creator define the title of the role created', () => {
            expect(adminRole).to.include.keys('title');
            expect(role.title).to.equal(adminRole.title);
        });
    });

    describe('Role Model Validation', () => {
        after(() => model.sequelize.sync({ force: true }));

        it('Should ensure unique roles by title', done => {
            Role.create(adminRole).then(() => {
                // attempting to create a second role with the same title as the first
                Role.create(adminRole).catch(error => {
                    expect(/UniqueConstraintError/.test(error.name)).to.be.true;
                    done();
                });
            });
        });
    });
});
