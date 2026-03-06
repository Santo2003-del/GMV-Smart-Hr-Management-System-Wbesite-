const mongoose = require('mongoose');
const User = require('./User');

const CompanyAdmin = User.discriminator(
    'CompanyAdmin',
    new mongoose.Schema({
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true
        }
    }, { discriminatorKey: 'role' })
);

module.exports = CompanyAdmin;
