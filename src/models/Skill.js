const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Skill = sequelize.define('skill', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        skill_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        parent_id: {
            type: Sequelize.INTEGER,
            defaultValue: 0
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

    Skill.associate = function (models) {
        Skill.hasOne(models.InstructorSkills, {
            foreignKey: 'skill_id'
        });
        Skill.hasOne(models.InstructorSkillsOfferingPref, {
            foreignKey: 'skill_id'
        });
        Skill.hasOne(models.Offerings, {
            foreignKey: 'skill_id'
        });
    }

    return Skill;
}