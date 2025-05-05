const asyncHandler = require("../middleware/asynchandler.js");
const {User} = require("../models");
const ErrorResponse = require("../utils/errorresponse.js");
const sendEmail = require("../utils/sendemail.js");
const crypto = require("crypto");
const path = require('path');

//@desc register a user to db ans sends back a token
//@route POST api/v1/auth/register
//@access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { firstname, lastname, email, password, role, phone } = req.body;

  if (role === "admin")
    throw new ErrorResponse("Cannot create admin users", 403);

  const user = await User.create({
    firstname,
    lastname,
    email,
    password,
    phone
  });

  sendTokenResponse(user, 200, res);
});

//@desc login a user
//@route POST api/v1/auth/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ErrorResponse("Please provide an email and password", 400);

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ErrorResponse("Invalid credentials", 401);

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new ErrorResponse("Invalid credentials", 401);

  user.lastLogin = new Date();
  user.save();

  sendTokenResponse(user, 200, res);
});

//@desc Log user out
//@route GET api/v1/auth/logout
//@access Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc get logged in user via token
//@route POST api/v1/auth/me
//@access Private
exports.getLoggedInUser = asyncHandler(async (req, res, next) => { 
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

//@desc Forgot password
//@route POST api/v1/auth/forgotpassword
//@access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) throw new ErrorResponse("there is no user with that email", 404);

  const resetToken = user.getResetPasswordToken();
  await user.save();
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `You are recieving this email because you (or someone else) has requested the reset of a password. Please make a put request to ${resetUrl}`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: "password reset token",
      message,
    });
    res.status(200).json({
      success: true,
      data: "Email sent",
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

//@desc reset password via token
//@route PUT api/v1/auth/resetpassword/:resettoken
//@access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  resetToken = req.params.resettoken;
  console.log("original reset token: " + resetToken);
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log("hashed reset token: " + resetPasswordToken);
  // Find the User with the resetPasswordToken field
  const user = await User.findOne({ resetPasswordToken: resetPasswordToken });

  if (!user) throw new ErrorResponse("Invalid token", 400);

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

//@desc Update password for currently logged in user
//@route PUT api/v1/auth/updatepassword
//@access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.matchPassword(req.body.currentPassword);

  if (!isMatch) throw new ErrorResponse("Incorrect password", 401);

  user.password = req.body.newPassword;
  user.save({ validateBeforeSave: true });

  sendTokenResponse(user, 200, res);
});

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  
  const fieldsToUpdate = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
  };

  if(req.body.currentPassword && req.body.newPassword){

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.matchPassword(req.body.currentPassword);
    if (!isMatch) throw new ErrorResponse("Incorrect password", 401);

    user.password = req.body.newPassword;
    
    await user.save();
  }
  
  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});


//@desc Uploads an image to to the file system and stores the file name in the database
//@route PUT /api/v1/auth/pfp
//@access Private
exports.uploadUserProfilePicture = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) throw new ErrorResponse("user not found in database", 404);
  if (!req.files) throw new ErrorResponse("please upload a file", 400);

  const file = req.files.file;
  console.log(file);

  if (!file.mimetype.startsWith("image"))
    throw new ErrorResponse("please upload an image file", 400);

  if (file.size > process.env.MAX_FILE_UPLOAD)
    throw new ErrorResponse(
      `please upload an image less than ${MAX_FILE_UPLOAD / 1024 / 1024}mb`,
      400
    );

  file.name = `photo_${user._id}${path.parse(file.name).ext}`;

  user.profilePicture = file.name;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (error) => {
    if (error) return next(error);
    await user.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});



const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user
  });
};
