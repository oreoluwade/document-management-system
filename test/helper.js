import faker from 'faker';

module.exports = {
  createUser: () => {
    const roleId = 2;
    const fakeUser = {
      userName: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      roleId
    };
    return fakeUser;
  },

  createAdmin: () => {
    const roleId = 1;
    const fakeUser = {
      userName: faker.internet.userName(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: faker.internet.password(),
      email: faker.internet.email(),
      roleId
    };
    return fakeUser;
  },

  createRole: () => {
    const fakeRole = {
      title: faker.lorem.word(),
    };
    return fakeRole;
  },

  // createDocument: () => {
  //   const fakeDocument = {
  //     published: Date(),
  //     title: faker.lorem.word(),
  //     access: 'public',
  //     content: faker.lorem.sentences(),
  //     ownerId: 2,
  //     ownerRoleId: 2
  //   };
  //   return fakeDocument;
  // }
};

