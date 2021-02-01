const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Offerings = sequelize.define('offerings', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT
        },
        start_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        end_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'COMPLETE'),
            defaultValue: 'ACTIVE'
        },
        cost: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        total_session: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        avg_rating: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isIn: [[1, 2, 3, 4, 5]]
            }
        },
        thumbnail_link: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        current_reschedule: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                max: this.total_session
            }
        },
        student_resource: {
            type: Sequelize.JSON,
            allowNull: false
        },
        instructor_resource: {
            type: Sequelize.JSON,
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

    Offerings.associate = function (models) {
        Offerings.belongsTo(models.Instructors);
        Offerings.belongsTo(models.Skill);
        Offerings.belongsTo(models.InstructorSkillsOfferingPref);
        Offerings.hasOne(models.OfferingAvailability, {
            foreignKey: 'offering_id'
        });
        Offerings.hasOne(models.Sessions, {
            foreignKey: 'offering_id'
        });
        Offerings.hasOne(models.SessionMaterial, {
            foreignKey: 'offering_id'
        });
        Offerings.hasOne(models.Orders, {
            foreignKey: 'offering_id'
        });
    };

    return Offerings;
}