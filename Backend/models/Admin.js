const mongoose = require('mongoose');
const User = require('./User');

const Admin = User.discriminator(
    'Admin',
    new mongoose.Schema({
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true
        },
        department: { type: String, default: '' }
    }, { discriminatorKey: 'role' })
);

module.exports = Admin;
