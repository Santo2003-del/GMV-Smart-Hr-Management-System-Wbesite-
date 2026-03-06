const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    mobile: { type: String, default: "0000000000" },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Inactive', 'Rejected'],
      default: 'Pending',
      index: true
    },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
    passwordChangedAt: { type: Date, default: null },
    profileImage: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  {
    timestamps: true,
    discriminatorKey: 'role'
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  if (this._isPasswordAlreadyHashed) {
    delete this._isPasswordAlreadyHashed;
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordChangedAt = new Date();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
