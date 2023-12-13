module.exports = (sequelize, Sequelize) => {
    return sequelize.define("Payment", {
        name: {
            type: Sequelize.STRING,
            unique: true
        }
    });
};
