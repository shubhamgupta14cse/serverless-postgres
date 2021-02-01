const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const InstructorSkills = sequelize.define('instructor_skills', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        avg_rating: {
            type: Sequelize.INTEGER,
            validate: {
                isIn: [[1, 2, 3, 4, 5]]
            },
            allowNull: false
        },
        online_exp: {
            type: Sequelize.INTEGER,
            validate: {
                max: 100,
                min: 0
            }
        },
        offline_exp: {
            type: Sequelize.INTEGER,
            validate: {
                max: 100,
                min: 0
            }
        },
        offering_type: {
            type: Sequelize.ENUM('SOLO', 'GROUP', 'BOTH'),
            defaultValue: 'BOTH'
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

    InstructorSkills.associate = function (models) {
        InstructorSkills.belongsTo(models.Instructors);
        InstructorSkills.belongsTo(models.Skill);
        InstructorSkills.hasOne(models.InstructorSkillsDoc, {
            foreignKey: 'instructor_skills_id'
        });
        InstructorSkills.hasOne(models.InstructorSkillsMedia, {
            foreignKey: 'instructor_skills_id'
        });
        InstructorSkills.hasOne(models.InstructorSkillsOfferingPref, {
            foreignKey: 'instructor_skills_id'
        });
        InstructorSkills.hasOne(models.Availability, {
            foreignKey: 'instructor_skills_id'
        });
    }

    return InstructorSkills;
}