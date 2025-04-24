const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const AppError = require('../utils/appError.js');
const catchAsync = require('../utils/catchAsync.js');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const winston = require('winston');

// Set up Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/email.log' }),
    new winston.transports.Console()
  ]
});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // e.g., '30d'
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Secure in production
  });

  user.password = undefined;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    employeeId: req.body.employeeId,
    department: req.body.department,
    phoneNumber: req.body.phoneNumber,
    designation: req.body.designation,
    isActive: req.body.isActive ?? true,
    otpEnabled: req.body.otpEnabled ?? true,
  });
  console.log('New user registered:', {
    timestamp: new Date().toISOString(),
    userId: newUser._id,
    email: newUser.email,
    role: newUser.role,
    employeeId: newUser.employeeId,
    department: newUser.department,
    permissions: newUser.permissions,
  });
  
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  
  const user = await User.findOne({ email }).select('+password +otpCode +otpExpires');
  
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  
  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated', 401));
  }

  if (user.otpEnabled) {
    const otp = user.createOTP();
    await user.save({ validateBeforeSave: false });
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Your OTP for Login',
        html: `
          <h1>One-Time Password (OTP)</h1>
          <p>Hello ${user.name},</p>
          <p>Your OTP for login is <strong>${otp}</strong>.</p>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        `,
      });
      logger.info('OTP email sent:', {
        userId: user._id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });
      
      res.status(200).json({
        status: 'otp_required',
        message: 'OTP sent to your registered email',
        userId: user._id,
      });
    } catch (error) {
      user.otpCode = undefined;
      user.otpExpires = undefined;
      await user.save({ validateBeforeSave: false });
      logger.error('Error sending OTP email:', {
        userId: user._id,
        email: user.email,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      return next(new AppError('Failed to send OTP. Please try again.', 500));
    }
  } else {
    console.log('User logged in successfully:', {
      timestamp: new Date().toISOString(),
      userId: user._id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      permissions: user.permissions,
    });
    
    createSendToken(user, 200, res);
  }
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return next(new AppError('Please provide user ID and OTP', 400));
  }

  const user = await User.findById(userId).select('+otpCode +otpExpires');
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (!user.otpCode || !user.otpExpires) {
    return next(new AppError('No OTP request found', 400));
  }

  if (!user.verifyOTP(otp)) {
    return next(new AppError('Invalid or expired OTP', 400));
  }

  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  logger.info('OTP verified successfully:', {
    userId: user._id,
    email: user.email,
    timestamp: new Date().toISOString(),
  });

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully for user:', decoded.id);
    
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('User no longer exists', 401));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppError('Password changed - please log in again', 401));
    }

    req.user = currentUser;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return next(new AppError('Invalid or expired token', 401));
  }
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }
  
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/reset-password/${resetToken}`;
    
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
      token: resetToken, // Remove in production
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    
    return next(
      new AppError('There was an error sending the email. Try again later!', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }
  
  user.password = req.body.password;
  await user.save();
  
  createSendToken(user, 200, res);
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  try {
    const users = await User.find().select('-password -otpCode -otpExpires');
    if (!users) throw new Error('No users found');
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch users',
    });
  }
});

exports.getUserByEmployeeId = catchAsync(async (req, res, next) => {
  const { employeeId } = req.params;
  
  const user = await User.findOne({ employeeId }).select('-password -otpCode -otpExpires');
  if (!user) {
    return next(new AppError('No user found with that employee ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  
  const allowedUpdates = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    department: req.body.department,
    phoneNumber: req.body.phoneNumber,
    designation: req.body.designation,
    isActive: req.body.isActive,
    otpEnabled: req.body.otpEnabled,
    permissions: req.body.permissions,
  };

  Object.keys(allowedUpdates).forEach(
    (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
  );

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    Object.assign(user, allowedUpdates);
    await user.save({ validateBeforeSave: true });

    console.log('User updated:', {
      timestamp: new Date().toISOString(),
      userId: user._id,
      email: user.email,
      updatedBy: req.user._id,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          employeeId: user.employeeId,
          department: user.department,
          phoneNumber: user.phoneNumber,
          designation: user.designation,
          isActive: user.isActive,
          otpEnabled: user.otpEnabled,
          permissions: user.permissions,
        },
      },
    });
  } catch (err) {
    console.error('Error updating user:', err);
    return next(new AppError('Error updating user', 400));
  }
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    if (user._id.toString() === req.user._id.toString()) {
      return next(new AppError('You cannot delete your own account', 403));
    }

    await User.findByIdAndDelete(userId);

    console.log('User deleted:', {
      timestamp: new Date().toISOString(),
      userId: user._id,
      email: user.email,
      deletedBy: req.user._id,
    });

    res.status(204).json({
      status: 'SUCCESS',
      message: 'User deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    return next(new AppError('Error deleting user', 400));
  }
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.role || req.body.permissions || req.body.isActive) {
    return next(
      new AppError('This route is not for password, role, permissions, or status updates', 400)
    );
  }

  const allowedUpdates = {
    name: req.body.name,
    email: req.body.email,
    department: req.body.department,
    phoneNumber: req.body.phoneNumber,
    designation: req.body.designation,
    otpEnabled: req.body.otpEnabled,
  };

  Object.keys(allowedUpdates).forEach(
    (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
  );

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    Object.assign(user, allowedUpdates);
    await user.save({ validateBeforeSave: true });

    console.log('User updated their profile:', {
      timestamp: new Date().toISOString(),
      userId: user._id,
      email: user.email,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          employeeId: user.employeeId,
          department: user.department,
          phoneNumber: user.phoneNumber,
          designation: user.designation,
          isActive: user.isActive,
          otpEnabled: user.otpEnabled,
          permissions: user.permissions,
        },
      },
    });
  } catch (err) {
    console.error('Error updating user profile:', err);
    return next(new AppError('Error updating your profile', 400));
  }
});