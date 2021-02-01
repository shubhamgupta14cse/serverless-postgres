const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Ratings = sequelize.define('ratings', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        student_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rating: {
            type: Sequelize.INTEGER,
            validate: {
                isIn: [[1, 2, 3, 4, 5]]
            },
            allowNull: false
        },
        feedback: {
            type: Sequelize.TEXT,
        },
        compliment: {
            type: Sequelize.TEXT,
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

    Ratings.associate = function (models) {
        Ratings.hasOne(models.InstructorRating, {
            foreignKey: 'rating_id'
        });
        Ratings.hasOne(models.Orders, {
            foreignKey: 'rating_id'
        });
        Ratings.hasOne(models.StudentSessions, {
            foreignKey: 'rating_id'
        });
    }

    return Ratings;
}