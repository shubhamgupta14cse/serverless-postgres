const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const OfferingAvailbility = sequelize.define('offering_availability', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        batch_type: {
            type: Sequelize.ENUM('SOLO', 'GROUP', 'CUSTOM'),
            defaultValue: 'GROUP'
        },
        start_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        end_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
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

    OfferingAvailbility.associate = function (models) {
        OfferingAvailbility.belongsTo(models.Instructors);
        OfferingAvailbility.belongsTo(models.Availability);
        OfferingAvailbility.belongsTo(models.Offerings);
    };

    return OfferingAvailbility;
}