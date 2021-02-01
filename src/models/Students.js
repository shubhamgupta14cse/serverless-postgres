const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Students = sequelize.define('students', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        middle_name: {
            type: Sequelize.STRING,
            defaultValue: ''
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        },
        passowrd: {
            type: Sequelize.STRING,
            allowNull: false
        },
        gender: {
            type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER'),
            allowNull: false
        },
        image_url: {
            type: Sequelize.TEXT
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

    Students.associate = function (models) {
        Students.hasOne(models.StudentAddress, {
            foreignKey: 'student_id'
        });
        Students.hasOne(models.Orders, {
            foreignKey: 'student_id'
        });
        Students.hasOne(models.StudentSessions, {
            foreignKey: 'student_id'
        });
        Students.hasOne(models.Solutions, {
            foreignKey: 'student_id'
        });
    }

    return Students;
}