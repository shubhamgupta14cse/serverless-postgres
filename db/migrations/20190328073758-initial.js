const fs = require('fs');
const exec = require('child_process').exec;

module.exports = {
  up: function(queryInterface, Sequelize) {
    return new Promise((resolve, reject) => {
      exec(`PGPASSWORD=${process.env.DB_PASSWORD} psql -U ${process.env.DB_USERNAME} -h ${process.env.DB_HOST} -d ${process.env.DB_NAME} -f ${__dirname}/../SQLScripts/initial_db.sql`, (error, _stdout, _stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropAllTables();
  }
};
