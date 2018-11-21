import faker from 'faker';

export default {
  createAdmin() {
    const adminUser = {
      userName: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      roleId: 1
    };
    return adminUser;
  },

  createUser() {
    const newUser = {
      userName: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      roleId: 2
    };
    return newUser;
  },

  createAdminRole() {
    const adminRole = {
      title: 'admin',
    };
    return adminRole;
  },

  createRegularRole() {
    const regularRole = {
      title: 'regular'
    };
    return regularRole;
  },

  createDocument() {
    const publicDocument = {
      title: faker.lorem.word(),
      content: faker.lorem.sentences(),
      access: 'public'
    };
    return publicDocument;
  },

  createPrivateDocument() {
    const privateDocument = {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraph(),
      access: 'private',
    };
    return privateDocument;
  },

  createRoleDocument() {
    const sampleDocument = {
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraph(),
      // access: 'role',
    };
    return sampleDocument;
  },

  documentsBundle() {
    const documentArray = [];
    for (let i = 0; i <= 15; i += 1) {
      documentArray.push({
        title: faker.company.catchPhrase(),
        content: faker.lorem.paragraph(),
        ownerId: 1
      });
    }
    return documentArray;
  }
};

