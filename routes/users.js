const express = require("express");
const {User} = require("../models");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadProfilePicture
} = require("../controllers");

const { protect, authorize, advancedResults } = require("../middleware");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getAllUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

router.route("/:id/photo").put(uploadProfilePicture);

module.exports = router;
