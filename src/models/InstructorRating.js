const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const InstructorRating = sequelize.define('instructor_rating', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
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

    InstructorRating.associate = function (models) {
        InstructorRating.belongsTo(models.Instructors);
        InstructorRating.belongsTo(models.Ratings);
    }

    return InstructorRating;
}