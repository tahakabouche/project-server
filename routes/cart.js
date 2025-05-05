const express = require("express");

const { getCartItems,
    deleteCart,
    addToCart,
    updateCartItem,
    removeCartItem } = require("../controllers");

const { protect } = require("../middleware");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getCartItems)
  .post(addToCart)
  .delete(deleteCart);

router
  .route("/:productId")
  .put(updateCartItem)
  .delete(removeCartItem);


module.exports = router;
