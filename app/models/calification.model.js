module.exports = (sequelize, Sequelize) => {
    return sequelize.define("Calification", {
        content: {
            type: Sequelize.STRING,
        },
        rate: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
};
