'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Document', [{
      title: 'Enitan',
      content: 'You is beautiful, you is kind, you is lovely, and even though there be people who tell you that you will amount to nothing, you can count on me to be true and to say the truth. You are brilliant, I say this to you, I say this about you. You have me Enitan, I solemnly swear, you have me.',
      access: 'public',
      ownerId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Essays In Love',
      content: 'Love is the complete absence of self. Unadulterated love that is.',
      access: 'private',
      ownerId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Shit hits the fan',
      content: 'Stuff happen that throw you into limbo and wonder if you are good enough',
      access: 'role',
      ownerId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Good stuff happen',
      content: 'Whatever they may tell you, good things still happen.',
      access: 'role',
      ownerId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Dan Brown',
      content: 'I would rave about Dan or Gladwell, but I would prefer that you experience them yourself. Maybe only then would you believe me when I say they and Deaver are in a highly esteemed class of their own.',
      access: 'public',
      ownerId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
