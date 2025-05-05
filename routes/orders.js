const express = require("express");
const { Order } = require("../models");
const { createOrder, getAllOrders, getOrder, updateOrder, deleteOrder } = require("../controllers");

const { protect, authorize, watch, advancedResults } = require("../middleware");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin"), advancedResults(Order), getAllOrders)
  .post(watch, createOrder);

router
  .route("/:id")
  .get(protect, authorize("admin"), getOrder)
  .put(protect, authorize("admin"), updateOrder)
  .delete(protect, authorize("admin"), deleteOrder);

module.exports = router;
