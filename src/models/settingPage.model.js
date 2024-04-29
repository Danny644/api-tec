const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fieldSchema = require('./fields.model');
const mongoosePaginate = require('mongoose-paginate-v2');

const settingPageSchema = new Schema({
    type: String,
    fields: [fieldSchema],
    letterhead: { type: Schema.Types.ObjectId, ref: 'Image' },
    logo: { type: Schema.Types.ObjectId, ref: 'Image' },
    //images: [String],
    font: { type: Schema.Types.ObjectId, ref: 'FontFiles' },
    version: String,
    date: Date
});

settingPageSchema.plugin(mongoosePaginate);

const settingPageModel = mongoose.model('settingPage', settingPageSchema);

module.exports = { settingPageModel };