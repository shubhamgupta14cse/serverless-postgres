const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const SessionMaterial = sequelize.define('session_material', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        notes: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        student_resource: {
            type: Sequelize.JSON,
            allowNull: false
        },
        instructor_resource: {
            type: Sequelize.JSON,
            allowNull: false
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

    SessionMaterial.associate = function (models) {
        SessionMaterial.belongsTo(models.Sessions);
        SessionMaterial.belongsTo(models.Offerings);
    };

    return SessionMaterial;
}