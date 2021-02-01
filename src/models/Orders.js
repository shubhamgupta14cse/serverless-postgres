const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Orders = sequelize.define('orders', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        receipt: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        paid_ammount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        due_ammount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        status: {
            type: Sequelize.ENUM('PAID', 'UNPAID', 'INPROGRESS'),
            defaultValue: 'UNPAID'
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

    Orders.associate = function (models) {
        Orders.belongsTo(models.Students);
        Orders.belongsTo(models.Offerings);
        Orders.belongsTo(models.Ratings);
        Orders.hasOne(models.Payments, {
            foreignKey: 'order_id'
        });
    };

    return Orders;
}