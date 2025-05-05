const { asyncHandler } = require("../middleware");
const { Product, User, Order, ShippingCost } = require("../models/index.js");
const ErrorResponse = require("../utils/errorresponse.js");

//@desc creates an order
//@route POST /api/v1/orders
//@access Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  let cart = [];
  let shippingCost;

  if (!req.user) {
    req.body.cart.forEach((item) => {
      const product = Product.findById(item.product);

      if (!product) throw new ErrorResponse(
                      "a product in the cart don exist in database",
                      400
                    );

      cart.push({
        product: item.product,
        quantity: item.quantity,
        size: item.size,
      });
    });
  } else {
    cart = req.user.cart;
  }

  if (!cart || cart.length === 0)
    throw new ErrorResponse("the cart is empty or dont exist", 400);

  const shippingRate = await ShippingCost.getShippingRate(
    req.body.state
  );
  
  if(req.body.shippingType === 'Home')
     shippingCost = shippingRate.homeCost;

  if(req.body.shippingType === 'Stopdesk')
     shippingCost = shippingRate.stopDeskCost;

  if (!shippingCost) throw new ErrorResponse("state does not exist");

  const order = await Order.create({
    user: req.user ? req.user._id : undefined,
    items: cart,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    shippingAddress: {
      state: req.body.state,
      address: req.body.address,
    },
    shippingType: req.body.shippingType,
    shippingCost,
  });

  //clear cart after submitting order
  if(req.user){
    req.user.cart = [];
    req.user.save();
  }
  
  res.status(201).json({
    success: true,
    data: order,
  });
});

//@desc gets all orders
//@route GET /api/v1/orders
//@access Private/Admin
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});


//@desc gets a single order
//@route GET /api/v1/orders/:id
//@access Private/Admin
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('items.product');

  if (!order) throw new ErrorResponse("id not found in database", 404);

  res.status(200).json({
    success: true,
    data: order,
  });
});

//@desc updates an order with a given id from database
//@route PUT /api/v1/orders/:id
//@access Private/Admin
exports.updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!order) throw new ErrorResponse("id not found in database", 404);

  res.status(200).json({
    success: true,
    data: order,
  });
});

//@desc deletes an Order with a given id from database
//@route DELETE /api/v1/orders/:id
//@access Private/Admin
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) throw new ErrorResponse("id not found in database", 404);

  res.status(200).json({
    success: true,
    data: [],
  });
});