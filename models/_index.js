'use strict';
const fs = require('fs');
const _ = require('lodash');

let files = fs.readdirSync(__dirname)

files = _.pull(files, '_index.js', '_crud.js')

let models = {}

//  Load and create the models for each entity.
files.forEach(file => {
  const filename = file.substring(0, file.length - 3)
  models[filename] = require(`./${file}`)(models)
})

module.exports = models;