'use strict';

const db = require('../../src/common/MySQLDBHandler');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('instructors', [{
      first_name: 'shubham ',
      middle_name: '',
      last_name: 'gupta',
      email: 'shubhamgupta11727@gmail.com',
      phone_no:'1111111111',
      password:'$2a$10$LSM9WUQPRRF/Dyrt5ININOhaG/Cmt/N/glmiWv7Iy7TEsq2SpIZiS',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('instructors', null, {});
  }
};
