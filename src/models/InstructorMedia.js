const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const InstructorMedia = sequelize.define('instructor_media', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        link: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        content_type: {
            type: Sequelize.ENUM('PHOTO', 'VIDEO'),
            defaultValue: 'PHOTO'
        },
        media_type: {
            type: Sequelize.ENUM('WORK_SAMPLE', 'INTRO'),
            defaultValue: 'INTRO'
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

    InstructorMedia.associate = function (models) {
        InstructorMedia.belongsTo(models.Instructors);
        InstructorMedia.hasOne(models.InstructorSkillsMedia, {
            foreignKey: 'instructor_media_id'
        });
    }

    return InstructorMedia;
}