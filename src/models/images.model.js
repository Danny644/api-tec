const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    name: {type: String, required: true},
    url: String, 
    type: String,
    version: String,
  });
  
  const ImageModel = mongoose.model('Image', imageSchema);

module.exports = { ImageModel };
