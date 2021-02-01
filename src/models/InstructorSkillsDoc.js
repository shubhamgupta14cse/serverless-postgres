const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const InstructorSkillsDoc = sequelize.define('instructor_skills_doc', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
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

    InstructorSkillsDoc.associate = function (models) {
        InstructorSkillsDoc.belongsTo(models.Instructors);
        InstructorSkillsDoc.belongsTo(models.InstructorDocs);
        InstructorSkillsDoc.belongsTo(models.InstructorSkills);
    }

    return InstructorSkillsDoc;
}