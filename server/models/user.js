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
      validate: {
        isEmail: {
          msg: 'Please, provide a valid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: 6 }
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2
    },
  }, {
    freezeTableName: true,
    hooks: {
      beforeCreate(user) {
        user.hashPassword();
      },
      beforeUpdate(user) {
        user.hashPassword();
      }
    },
  });

  // Class method
  User.associate = (models) => {
    User.belongsTo(models.Role, {
      onDelete: 'CASCADE',
      foreignKey: 'roleId'
    });
    User.hasMany(models.Document, {
      onDelete: 'CASCADE',
      foreignKey: 'ownerId',
    });
  };

  // Instance methods
  User.prototype.hashPassword = function hashPassword() {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(9));
    return this.password;
  };

  User.prototype.validPassword = function validPassword(password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};
