const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    name: {type: String, required: true}, // nombre del archivo
    url: String, // Ruta en la carpeta assets
});

const FontFileModel = mongoose.model('FontFiles', fileSchema);

module.exports = { FontFileModel };