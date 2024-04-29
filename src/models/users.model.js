const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permissionLevel: { type: Number, required: true },
    department: { type: Schema.Types.ObjectId, ref: 'Department' },
    refreshToken: { type: String },
    revokedTokens: [{ type: String }],
    loggedOut: { type: Boolean, default: false },
    resetPassword: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    resetPasswordTokenExpires: Date,
});

UserSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', UserSchema);