import faker from 'faker';

module.exports.createUser = () => {
  const roleId = 2;
  const user = {
    username: faker.internet.userName(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    RoleId: roleId
  };
  return user;
};

module.exports.createAdmin = () => {
  const roleId = 1;
  const user = {
    username: faker.internet.username(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    RoleId: roleId
  };
  return user;
};
