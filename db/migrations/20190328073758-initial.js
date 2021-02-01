module.exports = {
  up: function(queryInterface, Sequelize) {
    return new Promise((resolve, reject) => {
      exec(`psql -u ${process.env.DB_USERNAME} -h ${process.env.DB_HOST} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} < ${__dirname}/../SQLScripts/initial_db.sql`, (error, _stdout, _stderr) => {
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
