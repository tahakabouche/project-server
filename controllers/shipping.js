const { asyncHandler } = require("../middleware");
const { Product, User, Order, ShippingCost } = require("../models/index.js");
const ErrorResponse = require("../utils/errorresponse.js");


//@route POST /api/v1/shipping
//@access Private/Admin
exports.updateShippingRates = asyncHandler(async (req, res, next) => {

    const shippingCost = await ShippingCost.getSingleDoc();
    
    shippingCost.shippingRates = req.body.shippingRates;
    console.log(req.body.shippingRates);
    

    if(!req.body.shippingRates || req.body.shippingRates.length === 0){
        throw new ErrorResponse('shipping rates dont exist');
    }    

    await shippingCost.save();
    
    res.status(201).json({
      success: true,  
    });

});

//@route GET /api/v1/shipping
//@access Public
exports.getShippingRates = asyncHandler(async (req, res, next) => {

    const shippingCost = await ShippingCost.getSingleDoc();
    
    res.status(201).json({
      success: true,
      data: shippingCost.shippingRates  
    });
});

//@route GET /api/v1/shipping/:state
//@access Public
exports.getShippingRate = asyncHandler(async (req, res, next) => {

  const shippingRate = await ShippingCost.getShippingRate(req.params.state);
  
  res.status(201).json({
    success: true,
    data: shippingRate  
  });
});
  
  