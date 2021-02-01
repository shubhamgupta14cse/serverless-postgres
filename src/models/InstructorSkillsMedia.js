const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const InstructorSkillsMedia = sequelize.define('instructor_skills_media', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        class_type: {
            type: Sequelize.ENUM('DEMO', 'REGULAR'),
            defaultValue: 'REGULAR'
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

    InstructorSkillsMedia.associate = function (models) {
        InstructorSkillsMedia.belongsTo(models.Instructors);
        InstructorSkillsMedia.belongsTo(models.InstructorMedia);
        InstructorSkillsMedia.belongsTo(models.InstructorSkills);
    }

    return InstructorSkillsMedia;
}