const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const StudentSessions = sequelize.define('student_sessions', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
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

    StudentSessions.associate = function (models) {
        StudentSessions.belongsTo(models.Students);
        StudentSessions.belongsTo(models.Sessions);
        StudentSessions.belongsTo(models.Ratings);
        StudentSessions.hasOne(models.Solutions, {
            foreignKey: 'student_session_id'
        });
    };

    return StudentSessions;
}