const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadProfilePicture
} = require("./users");

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductPhoto,
  deleteProductPhoto,
  deleteProductPhotos
} = require("./products.js");

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
} = require("./auth.js");

const {
  getCartItems,
  deleteCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("./cart.js");


const {
  updateShippingRates,
  getShippingRates,
  getShippingRate
} = require("./shipping.js");


const { 
  createOrder,
  getAllOrders,
  getOrder,
  deleteOrder,
  updateOrder
 } = require('./orders.js');

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadProfilePicture,
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductPhoto,
  deleteProductPhoto,
  deleteProductPhotos,
  register,
  login,
  getLoggedInUser,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
  updateDetails,
  uploadUserProfilePicture,
  getCartItems,
  deleteCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getShippingRates,
  getShippingRate,
  updateShippingRates
};
