module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
        'Role',
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        },
        {
            freezeTableName: true
        }
    );

    Role.associate = models => {
        Role.hasMany(models.User, {
            onDelete: 'CASCADE',
            foreignKey: 'roleId'
        });
    };

    return Role;
};
