const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fieldSchema = require('../models/fields.model');
const mongoosePaginate = require('mongoose-paginate-v2');



const writtenSchema = new Schema({
    tittle: String,
    fecha: Date,
    serieOficio: String,
    departamentoEmisor: String,
    campos: [fieldSchema], 
    letterhead: String,
    logo: String,
    departamento: { type: Schema.Types.ObjectId, ref: 'Department' },
    idUsuario: { type: Schema.Types.ObjectId, ref: 'User' },
});

writtenSchema.plugin(mongoosePaginate);

const Written = mongoose.model('writings', writtenSchema);

module.exports = Written;