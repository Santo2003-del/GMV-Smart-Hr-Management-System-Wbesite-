const mongoose = require('mongoose');
const User = require('./User');

const Employee = User.discriminator(
    'Employee',
    new mongoose.Schema({
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
            index: true
        },
        designation: { type: String, default: 'Staff' },
        salary: { type: Number, default: 0 },
        basicSalary: { type: Number, default: 0 },
        joiningDate: { type: Date, default: null },
        faceDescriptor: { type: mongoose.Schema.Types.Mixed, default: "[]" },
        faceDescriptorVec: { type: Buffer, default: null },
        isApproved: { type: Boolean, default: false },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        approvedAt: { type: Date, default: null },
        isWfhActive: { type: Boolean, default: false },
        wfhLocation: { lat: Number, lng: Number, address: String, approvedDate: Date },
        employeeCode: { type: String, default: '' },
        department: { type: String, default: '' },
        managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
    }, { discriminatorKey: 'role' })
);

module.exports = Employee;
