const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Availability = sequelize.define('availability', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        start_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        start_time: {
            type: Sequelize.TIME,
            allowNull: false
        },
        end_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        end_time: {
            type: Sequelize.TIME,
            allowNull: false
        },
        is_recurring: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        weekday: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['mon', 'tues', 'wed', 'thur', 'fri', 'sat', 'sun']]
            }
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

    Availability.associate = function (models) {
        Availability.belongsTo(models.InstructorSkills);
        Availability.hasOne(models.OfferingAvailability, {
            foreignKey: 'availability_id'
        });
    };

    return Availability;
}