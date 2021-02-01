const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Assignments = sequelize.define('assignments', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        assignment_link: {
            type: Sequelize.TEXT,
            allowNull: false
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

    Assignments.associate = function (models) {
        Assignments.belongsTo(models.Sessions);
        Assignments.hasOne(models.Solutions, {
            foreignKey: 'assignment_id'
        });
    };

    return Assignments;
}