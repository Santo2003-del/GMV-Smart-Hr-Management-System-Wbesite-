const mongoose = require('mongoose');
const User = require('./User');

const SuperAdmin = User.discriminator(
    'SuperAdmin',
    new mongoose.Schema({}, { discriminatorKey: 'role' })
);

module.exports = SuperAdmin;
