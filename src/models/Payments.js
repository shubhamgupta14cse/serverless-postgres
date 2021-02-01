const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Payments = sequelize.define('payments', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        payment_id: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        signature_id: {
            type: Sequelize.TEXT,
            defaultValue: ''
        },
        date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        ammount_paid: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
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

    Payments.associate = function (models) {
        Payments.belongsTo(models.Orders);
    };

    return Payments;
}