import User from '../models/user';
import catchAsync from '../utils/catchAsync';
import JWT from 'jsonwebtoken';
import AppError from '../utils/appError';
import { promisify } from 'util';
import sendEmail from '../utils/email';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const generateToken = (user) => {
  return JWT.sign({ id: user._id }, process.env.SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendToken = (user, statusCode, res) => {
  const token = generateToken(user);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // send token via cookie
  res.cookie('JWT', token, cookieOptions);
  // remove the password from json output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  sendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //   check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please enter username and password', 400));
  }

  //   check if user exist and password is correct
  const user = await User.findOne({ email: email }).select('+password ');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email or password is incorrect', 401));
  }

  //   if everything oks, send token to client
  sendToken(user, 200, res);
});

const protect = catchAsync(async (req, res, next) => {
  let token;
  // check if token exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Please signin or login', 401));
  }
  // verify token
  const decodedJWT = await promisify(JWT.verify)(token, process.env.SECRET);

  // check if user still exist
  const currentUser = await User.findById(decodedJWT.id);
  if (!currentUser) {
    return next(new AppError('User with this token no longer exist', 401));
  }

  // check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decodedJWT.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

// authorize roles
exports.authorizeOnly = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not authorized to perform this action', 403));
    }
    next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  // get user by email entered
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email', 404));
  }

  // Generate password reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //   send email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

  const message = `Forgot your password?, send a patch request with your password and passwordConfirm to ${resetUrl}\n If you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  sendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  //   login user and send jwt
  sendToken(user, 201, res);
});

export default { signUp, updatePassword, resetPassword, forgotPassword, protect, login };