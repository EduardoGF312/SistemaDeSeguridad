const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: String,
    username: String,
    password: String,
});

module.exports = mongoose.model('logins', userSchema);