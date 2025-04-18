const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const AppError = require('../utils/appError.js');
const catchAsync = require('../utils/catchAsync.js');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  
  // Simple 1-day cookie for testing
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    httpOnly: true,
  });

  user.password = undefined;
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
    isActive: req.body.isActive || true,
    otpEnabled: req.body.otpEnabled || false,
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
  
  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  
  // 3) Check if user is active
  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated', 401));
  }

  // Log successful login
  console.log('User logged in successfully:', {
    timestamp: new Date().toISOString(),
    userId: user._id,
    email: user.email,
    role: user.role,
    employeeId: user.employeeId,
    permissions: user.permissions,
  });
  
  // 4) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token
  let token;
  
  // Check authorization header first
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // Then check cookies
  else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('Authentication required', 401));
  }

  // 2) Verify token
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully for user:', decoded.id);
    
    // 3) Check if user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('User no longer exists', 401));
    }

    // 4) Check if password changed after token was issued
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
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }
  
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  
  // 3) Send it to user's email (mock implementation for now)
  try {
    // In a real app, you would send an email here
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/reset-password/${resetToken}`;
    
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
      token: resetToken, // In production, don't send the token in the response
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
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  
  // 3) Update changedPasswordAt property for the user
  // This is handled in the User model pre-save middleware
  
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }
  
  // 3) If so, update password
  user.password = req.body.password;
  await user.save();
  
  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
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
  
  const user = await User.findOne({ employeeId }).select('-password');
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
  
  // Fields that can be updated by admins
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

  // Remove undefined fields
  Object.keys(allowedUpdates).forEach(
    (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
  );

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('No user found with that ID', 404));
    }

    // Update user fields
    Object.assign(user, allowedUpdates);
    await user.save({ validateBeforeSave: true });

    // Log update
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

    await User.findByIdAndDelete(userId); // Replace user.remove()

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
  // Prevent updating sensitive fields
  if (req.body.password || req.body.role || req.body.permissions || req.body.isActive) {
    return next(
      new AppError('This route is not for password, role, permissions, or status updates', 400)
    );
  }

  // Fields that can be updated by the user themselves
  const allowedUpdates = {
    name: req.body.name,
    email: req.body.email,
    department: req.body.department,
    phoneNumber: req.body.phoneNumber,
    designation: req.body.designation,
    otpEnabled: req.body.otpEnabled,
  };

  // Remove undefined fields
  Object.keys(allowedUpdates).forEach(
    (key) => allowedUpdates[key] === undefined && delete allowedUpdates[key]
  );

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Update user fields
    Object.assign(user, allowedUpdates);
    await user.save({ validateBeforeSave: true });

    // Log update
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