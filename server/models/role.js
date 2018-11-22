module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    freezeTableName: true
  });

  // Class Methods
  Role.associate = (models) => {
      // associations can be defined here
    Role.hasMany(models.User, {
      onDelete: 'CASCADE',
      foreignKey: 'roleId'
    });
  }

  return Role;
};
