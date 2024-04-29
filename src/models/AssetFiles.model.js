const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    type: String, // icono, membrete, letra.
    name: { type: String, required: true}, // nombre del archivo
    url: String, // Ruta en la carpeta assets
});

const FileModel = mongoose.model('File', fileSchema);

module.exports = { FileModel };