const mongoose = require('mongoose');

const fileHistorySchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now },
    uploadedBy: String,
    auditTrail: [
      {
        action: String, 
        timestamp: { type: Date, default: Date.now },
        performedBy: String,
      },
    ]
  });
  
  const FileHistoryModel = mongoose.model('FilesHistory', fileHistorySchema);
  
  module.exports = {FileHistoryModel};
