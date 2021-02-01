const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Language = sequelize.define('language', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        language: {
            type: Sequelize.STRING(512),
            defaultValue: 'ENGLISH'
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

    Language.associate = function (models) {
        Language.hasOne(models.InstructorLanguage, {
            foreignKey: 'language_id'
        });
    }

    return Language;
}