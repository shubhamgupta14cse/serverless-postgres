const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const InstructorSkillsOfferingPref = sequelize.define('instructor_skills_offering_pref', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        batch_type: {
            type: Sequelize.ENUM('SOLO', 'GROUP', 'CUSTOM'),
            defaultValue: 'GROUP'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        max_student: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 50
            }
        },
        min_student: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: this.max_student
            }
        },
        max_session: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        min_session: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                max: this.max_session
            }
        },
        max_session_per_week: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isIn: [[1, 2, 3, 4, 5, 6, 7]]
            }
        },
        recommended_session_per_week: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isIn: [[1, 2, 3, 4, 5, 6, 7]]
            }
        },
        cost_per_student: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        total_reschedule: {
            type: Sequelize.INTEGER,
            validate: {
                max: this.max_session
            }
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

    InstructorSkillsOfferingPref.associate = function (models) {
        InstructorSkillsOfferingPref.belongsTo(models.Instructors);
        InstructorSkillsOfferingPref.belongsTo(models.Skill);
        InstructorSkillsOfferingPref.belongsTo(models.InstructorSkills);
        InstructorSkillsOfferingPref.hasOne(models.Offerings, {
            foreignKey: 'instructor_skills_offering_pref_id'
        });
    }

    return InstructorSkillsOfferingPref;
}