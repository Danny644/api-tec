const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const indexSchema = new Schema({
    numero: Number,
    valor: String
  });


  const positionSchema = new Schema({
    name: String,
    index: [indexSchema]

  });

  const positionModel = mongoose.model('Position', positionSchema);

module.exports = positionModel;