const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: [
      'admin',
      'procurement_officer',
      'committee_member',
      'evaluator',
      'bidder',
      'complaint_manager',
      'project_manager',
    ],
    required: [true, 'Please provide a role'],
  },
  employeeId: {
    type: String,
    required: [true, 'Please provide employee ID'],
    unique: true,
  },
  department: {
    type: String,
    required: [true, 'Please provide department'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide phone number'],
  },
  designation: {
    type: String,
    required: [true, 'Please provide designation'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  otpEnabled: {
    type: Boolean,
    default: true,
  },
  otpCode: {
    type: String,
    select: false,
  },
  otpExpires: {
    type: Date,
    select: false,
  },
  permissions: {
    type: [String],
    default: function () {
      const rolePermissions = {
        admin: ['manage_users', 'manage_committees'],
        procurement_officer: [],
        committee_member: [],
        evaluator: [],
        bidder: [],
        complaint_manager: [],
        project_manager: [],
      };
      return rolePermissions[this.role] || [];
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Update passwordChangedAt when password is modified
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Method to check password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Method to create OTP
userSchema.methods.createOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  this.otpCode = crypto.createHash('sha256').update(otp).digest('hex');
  this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function (candidateOTP) {
  if (!this.otpCode || !this.otpExpires) return false;
  const hashedOTP = crypto.createHash('sha256').update(candidateOTP).digest('hex');
  return hashedOTP === this.otpCode && this.otpExpires > Date.now();
};

const User = mongoose.model('User', userSchema);
module.exports = User;
