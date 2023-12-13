const { DataTypes } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
    return sequelize.define("Product", {
        name: {
            type: Sequelize.STRING
        },
        category: {
            type: Sequelize.ENUM,
            values: ['ROPA', 'ELECTRÓNICA', 'HOGAR', 'COMIDA']
        },
        price: {
            type: Sequelize.INTEGER
        },
        availableQty: {
            type: Sequelize.INTEGER
        },
        productImage: {
            type: Sequelize.TEXT
        }
    });
};
