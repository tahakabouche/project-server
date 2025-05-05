const { asyncHandler } = require("../middleware");
const { User } = require("../models");
const ErrorResponse = require("../utils/errorresponse.js");
const path = require("path");

//@desc gets all users from database
//@route GET /api/v1/users
//@access Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc gets a single user from database
//@route GET /api/v1/users/:id
//@access Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("+password");

  if (!user) throw new ErrorResponse("User not found", 404);

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Updates a user from database
//@route PUT /api/v1/users/:id
//@access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  
  let user;
  user = await User.findById(req.params.id);

  if (!req.body.password) {
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  }

  if (!user) throw new ErrorResponse("User not found", 404);

  if (req.body.password) user.password = req.body.password;

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Deletes a user from database
//@route DELETE /api/v1/users/:id
//@access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) throw new ErrorResponse("User not found", 404);

  res.status(200).json({
    success: true,
    data: {},
  });
});

//@desc Creates a user in database
//@route POST /api/v1/users
//@access Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Uploads an image to to the file system and stores the file name in the database
//@route PUT /api/v1/users/:id/photo
//@access Private/Admin
exports.uploadProfilePicture = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

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
