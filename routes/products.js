const express = require("express");
const { Product } = require("../models");
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductPhoto,
  deleteProductPhoto,
  deleteProductPhotos,
} = require("../controllers");

const { protect, authorize, advancedResults } = require("../middleware");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(Product), getAllProducts)
  .post(protect, authorize("admin"), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(protect, authorize("admin"), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct);

router
  .route("/:id/photos")
  .put(protect, authorize("admin"), uploadProductPhoto)
  .delete(protect, authorize("admin"), deleteProductPhotos);

router
  .route("/:id/:filename")
  .delete(protect, authorize("admin"), deleteProductPhoto);

module.exports = router;
