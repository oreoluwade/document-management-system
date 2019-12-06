import bcrypt from 'bcrypt-nodejs';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            firstname: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastname: {
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
                validate: { len: 6 }
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 2
            }
        },
        {
            freezeTableName: true,

            hooks: {
                beforeCreate: user => user.password && user.hashPassword(),
                beforeUpdate: user => user.password && user.hashPassword()
            }
        }
    );

    User.associate = models => {
        User.belongsTo(models.Role, {
            onDelete: 'CASCADE',
            foreignKey: 'roleId'
        });

        User.hasMany(models.Document, {
            onDelete: 'CASCADE',
            foreignKey: 'ownerId'
        });
    };

    User.prototype.hashPassword = async function hashPassword() {
        this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(9));
    };

    User.prototype.validPassword = async function validPassword(password) {
        return bcrypt.compareSync(password, this.password);
    };
    return User;
};
