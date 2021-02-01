const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const InstructorDocs = sequelize.define('instructor_docs', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        link: {
            type: Sequelize.TEXT,
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

    InstructorDocs.associate = function (models) {
        InstructorDocs.belongsTo(models.Instructors);
        InstructorDocs.belongsTo(models.InstructorDocs);
        InstructorDocs.hasOne(models.InstructorSkillsDoc, {
            foreignKey: 'instructor_docs_id'
        });
    }

    return InstructorDocs;
}