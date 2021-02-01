'use strict';

const Sequelize = require('sequelize');
const Models = require('../models');

const db = {};

// workaround for meeting internal peer dependencies of sequelize during webpack packaging

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    schema: 'abiliyo',
    pool: {
      max: 5,//Maximum number of connection in pool
      min: 0,//Minimum number of connection in pool
      acquire: 60000,//The maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000//The maximum time, in milliseconds, that a connection can be idle before being released.
    }
  }
);

Object.keys(Models).forEach((modelName) => {
  if (typeof (Models[modelName]) == 'function') db[modelName] = Models[modelName](sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

const connection = {};

module.exports = async () => {
  if (connection.isConnected) {
    console.log('=> Using existing connection.')
    return db
  }

  await sequelize.sync()
  await sequelize.authenticate()
  connection.isConnected = true
  console.log('=> Created a new connection.')
  return db
}
