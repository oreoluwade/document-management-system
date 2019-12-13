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
                    username: 'admin',
                    firstname: 'admin',
                    lastname: 'admin',
                    email: 'admin@admin.com',
                    password: hashP('adminkey'),
                    roleId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    username: 'oreoluwade',
                    firstname: 'oreoluwa',
                    lastname: 'aboluwarin',
                    email: 'oreoluwade@gmail.com',
                    password: hashP('oreoluwade'),
                    roleId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    username: 'pelumiy',
                    firstname: 'pelumi',
                    lastname: 'aboluwarin',
                    email: 'pelumi@gmail.com',
                    password: hashP('pelumi'),
                    roleId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    username: 'funmi',
                    firstname: 'funmi',
                    lastname: 'olukanni',
                    email: 'funmi@gmail.com',
                    password: hashP('olufunmi'),
                    roleId: 4,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    username: 'thequeeness',
                    firstname: 'eseohe',
                    lastname: 'ojo',
                    email: 'eseohe@gmail.com',
                    password: hashP('thequeeness'),
                    roleId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    username: 'emmanuel',
                    firstname: 'emmanuel',
                    lastname: 'akinyele',
                    email: 'lanre_rd@yahoo.com',
                    password: hashP('emmanuel'),
                    roleId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    username: 'tosyne',
                    firstname: 'oluwatosin',
                    lastname: 'akingbulu',
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
