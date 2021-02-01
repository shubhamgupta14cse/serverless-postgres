const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Sessions = sequelize.define('sessions', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        session_no: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        total_session: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'COMPLETE'),
            defaultValue: 'ACTIVE'
        },
        batch_type: {
            type: Sequelize.ENUM('SOLO', 'GROUP', 'CUSTOM'),
            allowNull: false
        },
        start_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        start_time: {
            type: Sequelize.TIME,
            allowNull: false
        },
        end_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        end_time: {
            type: Sequelize.TIME,
            allowNull: false
        },
        avg_rating: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                isIn: [[1, 2, 3, 4, 5]]
            }
        },
        is_cancelled: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        is_rescheduled: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        conferenece_link: {
            type: Sequelize.TEXT,
            defaultValue: ''
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

    Sessions.associate = function (models) {
        Sessions.belongsTo(models.Offerings);
        Sessions.belongsTo(models.Instructors);
        Sessions.hasOne(models.SessionMaterial, {
            foreignKey: 'session_id'
        });
        Sessions.hasOne(models.StudentSessions, {
            foreignKey: 'session_id'
        });
    };

    return Sessions;
}