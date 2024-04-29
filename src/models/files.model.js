
  const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    officeNumber: { type: String, required: true },
    creationDate: { type: Date, default: Date.now },
    creator: { type: String, required: true },
    file: Buffer
    
});

const FileModel = mongoose.model('File', fileSchema);

module.exports = { FileModel };