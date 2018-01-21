import bcrypt from 'bcrypt-nodejs';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
  }, {
      hooks: {
        beforeCreate(user) {
          user.hashPassword();
        }
      }
    });

  User.associate = (models) => {
    User.belongsTo(models.Role, {
      onDelete: 'CASCADE',
      foreignKey: 'roleId'
    });

    User.hasMany(models.Document, {
      onDelete: 'CASCADE',
      foreignKey: 'ownerId'
    });
  }

  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.prototype.hashPassword = function () {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(9));
  };

  freezeTableName: true

  return User;
};
