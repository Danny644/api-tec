const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    name: {type: String, required: true},
    series: {type: String, required: true}
});

const DepartmentModel = mongoose.model('Department', departmentSchema);

module.exports =  { DepartmentModel };