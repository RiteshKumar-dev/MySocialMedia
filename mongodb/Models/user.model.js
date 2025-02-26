import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    firstname: {
      type: String,
      minlength: [3, 'FirstName must be at least 3 characters long'],
    },
    lastname: {
      type: String,
      minlength: [3, 'LastName must be at least 3 characters long'],
    },
    bio: {
      type: String,
      maxlength: [150, 'Bio must be at most 150 characters long'],
    },
    profession: {
      type: String,
      minlength: [3, 'Profession must be at least 3 characters long'],
    },
    avatar: {
      type: String,
    },
    bgImage: {
      type: String,
    },
    refreshToken: {
      type: String,
      select: false, // Security improvement
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    resetPasswordToken: {
      type: String,
      select: false, // Security improvement
    },
    resetPasswordExpire: {
      type: Date,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
    verifyCode: {
      type: String,
      select: false, // Security improvement
    },
    verifyCodeExpiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash Password Before Saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare Password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id, email: this.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  });
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' });
};

// Generate Reset Password Token
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes expiry
  return resetToken;
};

// Update Last Active Timestamp
userSchema.methods.updateLastActive = async function () {
  this.lastActiveAt = Date.now();
  await this.save({ validateBeforeSave: false });
};

// OTP Generation
userSchema.methods.generateOTP = async function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.verifyCode = crypto.createHash('sha256').update(otp).digest('hex');
  this.verifyCodeExpiry = Date.now() + 60 * 1000; // 1 minutes expiry
  await this.save();
  return otp;
};

// OTP Verification
userSchema.methods.verifyOTP = async function (otp) {
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  if (hashedOtp !== this.verifyCode || this.verifyCodeExpiry < Date.now()) {
    throw new Error('Invalid or expired OTP');
  }
  this.isVerified = true;
  this.verifyCode = undefined;
  this.verifyCodeExpiry = undefined;
  await this.save();
};

// Export Model (Avoid Multiple Model Declaration Error)
export const User = mongoose.models.User || mongoose.model('User', userSchema);
