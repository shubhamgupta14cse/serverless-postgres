const Sequelize = require('sequelize');
// const {enum: {
//   ADMINUSER_STATUS
// }} = require('../../src/common/constant.json')

module.exports = (sequelize) => {
  const Instructors = sequelize.define('instructors', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    middle_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    dob: {
      type: Sequelize.DATE
    },
    gender: {
      type: Sequelize.ENUM(
        "MALE",
        "FEMALE",
        "OTHER"
      ),
      defaultValue: "MALE",
    },
    image_url: {
      type: Sequelize.TEXT
    },
    avg_rating: {
      type: Sequelize.INTEGER,
      validate: {
        min: 0,
        max: 4
      },
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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

  Instructors.associate = function (models) {
    Instructors.hasOne(models.InstructorAddress, {
      foreignKey: 'instructor_id'
    });
    Instructors.hasOne(models.InstructorLanguage, {
      foreignKey: 'instructor_id'
    });
    Instructors.hasOne(models.InstructorRating, {
      foreignKey: 'instructor_id'
    });
    Instructors.hasOne(models.InstructorSkills, {
      foreignKey: 'instructor_id'
    });
    Instructors.hasOne(models.InstructorDocs, {
      foreignKey: 'instructor_id'
    });
    Instructors.hasOne(models.InstructorSkillsDoc, {
      foreignKey: 'instructor_id'
    });
    Instructors.hasOne(models.InstructorMedia, {
      foreignKey: 'instructor_id'
    });
    Instructors.hasOne(models.InstructorSkillsMedia, {
      foreignKey: 'instructor_id'
    });
    Instructors.hasOne(models.InstructorSkillsOfferingPref, {
      foreignKey: 'instructor_id'
    });
    Instructors.hasOne(models.Offerings, {
      foreignKey: 'instructor_id'
    });
    Instructors.hasOne(models.OfferingAvailability, {
      foreignKey: 'instructor_id'
    });
    Instructors.hasOne(models.Sessions, {
      foreignKey: 'instructor_id'
    });
  }

  return Instructors;
}
