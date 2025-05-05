const express = require("express");
const {
  register,
  login,
  getLoggedInUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
  updateDetails,
  uploadUserProfilePicture
} = require("../controllers");
const { protect } = require("../middleware");

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/me").get(protect, getLoggedInUser);

router.route("/forgotpassword").post(forgotPassword);

router.route("/resetpassword/:resettoken").put(resetPassword);

router.route("/updatepassword").put(protect, updatePassword);

router.route("/updatedetails").put(protect, updateDetails);

router.route("/uploadpfp").put(protect, uploadUserProfilePicture);

router.route("/logout").get(protect, logout);

module.exports = router;
