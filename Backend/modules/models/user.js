const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    mobile: { type: String, required: true },
    fullName: { type: String },
    image: { type: String },
    type: { type: String, default: 'user' },
    token: { type: String },
});
module.exports = mongoose.model('User', UserSchema);
