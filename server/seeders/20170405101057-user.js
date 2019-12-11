'use strict';
const bcrypt = require('bcrypt');
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
        return queryInterface.bulkInsert(
            'User',
            [
                {
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
                },
                {
                    userName: 'funmi',
                    firstName: 'funmi',
                    lastName: 'olukanni',
                    email: 'funmi@gmail.com',
                    password: hashP('olufunmi'),
                    roleId: 4,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    userName: 'thequeeness',
                    firstName: 'eseohe',
                    lastName: 'ojo',
                    email: 'eseohe@gmail.com',
                    password: hashP('thequeeness'),
                    roleId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    userName: 'emmanuel',
                    firstName: 'emmanuel',
                    lastName: 'akinyele',
                    email: 'lanre_rd@yahoo.com',
                    password: hashP('emmanuel'),
                    roleId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    userName: 'tosyne',
                    firstName: 'oluwatosin',
                    lastName: 'akingbulu',
                    email: 'tosinakingbulu@gmail.com',
                    password: hashP('oluwatosin'),
                    roleId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ],
            {}
        );
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
