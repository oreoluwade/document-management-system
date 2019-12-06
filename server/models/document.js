module.exports = (sequelize, DataTypes) => {
    const Document = sequelize.define(
        'Document',
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },

            content: {
                type: DataTypes.TEXT,
                allowNull: false
            },

            access: {
                type: DataTypes.STRING,
                defaultValue: 'public',
                allowNull: false
            },

            ownerId: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            freezeTableName: true
        }
    );

    Document.associate = models => {
        Document.belongsTo(models.User, {
            as: 'owner',
            onDelete: 'CASCADE',
            foreignKey: { allowNull: true }
        });
    };

    return Document;
};
