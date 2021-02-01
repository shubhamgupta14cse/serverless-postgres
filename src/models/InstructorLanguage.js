const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const InstructorLanguage = sequelize.define('instructor_language', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        preference: {
            type: Sequelize.ENUM('PRIMARY', 'SECONDARY'),
            defaultValue: 'PRIMARY'
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

    InstructorLanguage.associate = function (models) {
        InstructorLanguage.belongsTo(models.Instructors);
        InstructorLanguage.belongsTo(models.Language);
    }

    return InstructorLanguage;
}