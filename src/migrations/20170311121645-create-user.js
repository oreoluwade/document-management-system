module.exports = {
    up: (queryInterface, Sequelize) =>
        queryInterface.createTable('User', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            firstname: {
                type: Sequelize.STRING,
                allowNull: false
            },
            lastname: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: { isEmail: true }
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: { len: 6 }
            },
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 2
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
    down: (queryInterface, Sequelize) => queryInterface.dropTable('User')
};
