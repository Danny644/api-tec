const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fieldSchema = new Schema({
    name: String,
    text: String,
    font: { type: Schema.Types.ObjectId, ref: 'FontFiles'},
    size: Number,
    alignment: String,
    bold: Boolean,
    key: String,
  });

module.exports = fieldSchema;