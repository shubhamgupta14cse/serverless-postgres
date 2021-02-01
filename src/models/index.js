'use strict'

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const Models = {}

fs.readdirSync(__dirname)
    .filter(file => (
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    ))
    .forEach((file) => {
        let model = require('./' + file);
        let modelName = file.replace('.js', '');
        Models[modelName] = model;
    });

module.exports = Models;
