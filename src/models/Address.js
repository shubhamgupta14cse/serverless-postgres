const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Address = sequelize.define('address', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        address1: {
            type: Sequelize.STRING(512)
        },
        address2: {
            type: Sequelize.STRING(512)
        },
        city: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING
        },
        postal_code: {
            type: Sequelize.STRING
        },
        country_code: {
            type: Sequelize.STRING
        },
        country_code_description: {
            type: Sequelize.STRING
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: true,
        // Add soft delete/paranoid functionality
        paranoid: true
    });

    Address.associate = function (models) {
        Address.hasOne(models.InstructorAddress, {
            foreignKey: 'address_id'
        });
        Address.hasOne(models.StudentAddress, {
            foreignKey: 'address_id'
        });
    }
    return Address;
}