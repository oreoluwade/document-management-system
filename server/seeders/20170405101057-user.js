'use strict';
const bcrypt = require('bcrypt-nodejs');
const hashP = password => bcrypt.hashSync(password, bcrypt.genSaltSync(9));
module.exports = {
  up: function(queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('User', [{
      userName: 'admin',
      firstName: 'admin',
      lastName: 'admin',
      email: 'admin@admin.com',
      password: hashP('adminkey'),
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
      {
        userName: 'oreoluwade',
        firstName: 'oreoluwa',
        lastName: 'aboluwarin',
        email: 'oreoluwade@gmail.com',
        password: hashP('oreoluwade'),
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userName: 'pelumiy',
        firstName: 'pelumi',
        lastName: 'aboluwarin',
        email: 'pelumi@gmail.com',
        password: hashP('pelumi'),
        roleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: function(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
