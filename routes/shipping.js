const express = require("express");

const {
  updateShippingRates,
  getShippingRates,
  getShippingRate
} = require("../controllers");

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route("/")
  .get(getShippingRates)
  .post(protect, authorize('admin'), updateShippingRates);

router
  .route("/:state")
  .get(getShippingRate);
  


module.exports = router;