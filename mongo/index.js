
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/teamup');

const Models = {};

const baseDir = __dirname;

fs.readdirSync(baseDir, {encoding: 'utf-8'}).forEach(fname => {
  if (fname !== 'index.js') {
    const modelData = require(path.join(baseDir, fname));
    modelData.name = modelData.name || fname.replace('.js', '');
    Models[modelData.name] = mongoose.model(modelData.name, modelData.fields)
  }
});

Models.Types = mongoose.Types;

module.exports = Models;
