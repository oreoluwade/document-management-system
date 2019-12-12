import bcrypt from 'bcrypt';

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
                beforeUpdate: user => {
                    if (user.changed('password')) {
                        return user.hashPassword();
                    }
                }
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
        console.log('PWord', this.password);
        this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(9));
        return this.password;
    };

    User.prototype.validPassword = async function validPassword(password) {
        const match = await bcrypt.compare(password, this.password);
        return match;
    };
    return User;
};
