module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'You must provide a Title'
        }
      }
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'You cannot have an empty Document'
        }
      }
    },

    access: {
      type: DataTypes.STRING,
      defaultValue: 'public',
      allowNull: false,
      validate: {
        isIn: [['private', 'public', 'role']]
      }
    },

    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    }
  });

  freezeTableName: true

  Document.associate = (models) => {
    Document.belongsTo(models.User, {
      as: 'owner',
      onDelete: 'CASCADE',
      foreignKey: { allowNull: true }
    })
  }

  return Document;
};
