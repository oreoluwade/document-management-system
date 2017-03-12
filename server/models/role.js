module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: DataTypes.STRING,
    allowNull: false,
    unique: true
  }, {
    classMethods: {
      associate(models) {
          // associations can be defined here
        Role.hasMany(models.User, {
          onDelete: 'CASCADE',
          foreignKey: 'roleId'
        });
      }
    },
    freezeTableName: true
  });
  return Role;
};
