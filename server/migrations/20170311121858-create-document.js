module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Document', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'You must provide a Title.'
        }
      }
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'You cannot have an empty Document.'
        }
      }
    },
    access: {
      type: Sequelize.STRING,
      defaultValue: 'public',
      allowNull: false,
      validate: {
        isIn: [['private', 'public', 'role']]
      }
    },
    ownerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Owner ID must be an integer'
        }
      }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Document')
};
