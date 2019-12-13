import faker from 'faker';

export default {
    createAdmin: () => {
        const admin = {
            username: faker.internet.userName(),
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
            roleId: 1
        };
        return admin;
    },

    createUser: () => {
        const regular = {
            username: faker.internet.userName(),
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            password: faker.internet.password(),
            email: faker.internet.email(),
            roleId: 2
        };
        return regular;
    },

    createAdminRole: () => {
        const payload = {
            title: 'admin'
        };
        return payload;
    },

    createRegularRole: () => {
        const payload = {
            title: 'regular'
        };
        return payload;
    },

    createDocument: () => {
        const document = {
            title: faker.lorem.word(),
            content: faker.lorem.sentences(),
            access: 'public'
        };
        return document;
    },

    createPrivateDocument: () => {
        const document = {
            title: faker.company.catchPhrase(),
            content: faker.lorem.paragraph(),
            access: 'private'
        };
        return document;
    },

    createRoleDocument: () => {
        const document = {
            title: faker.company.catchPhrase(),
            content: faker.lorem.paragraph(),
            access: 'role'
        };
        return document;
    },

    documentsBundle() {
        const documents = [];
        for (let i = 0; i <= 15; i += 1) {
            documents.push({
                title: faker.company.catchPhrase(),
                content: faker.lorem.paragraph(),
                ownerId: 1
            });
        }
        return documents;
    }
};
