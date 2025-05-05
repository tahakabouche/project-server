const { asyncHandler } = require("../middleware");
const { Product, User, ClothingProduct, ShoeProduct } = require("../models/index.js");
const ErrorResponse = require("../utils/errorresponse.js");


//@desc adds a product to cart 
//@route POST api/v1/cart
//@access Private
exports.addToCart = asyncHandler(async (req, res, next) => {

    const { productId, quantity, size } = req.body;

    if(!quantity || !size) throw new ErrorResponse('provide a size and quantity', 400);
    console.log(req.user);
  
    const user = await User.findById(req.user._id);
    const product = await Product.findById(productId);

    if(!product) throw new ErrorResponse('product does not exist', 404);

        //checks if a product already exists in cart and has the same chosen size as the current request
        const cartItem = user.cart.find(item => item.product.equals(productId)&&item.size === size);

        if(cartItem) {
            cartItem.quantity += quantity;
        }
        else {
            user.cart.push({
              product: productId,
              quantity: quantity,
              size: size
            });
        }

        user.cartLastUpdated = new Date(); 

        await user.save();

       res.status(200).json({
          success: true,
          data: user.cart,
       });
});

//@desc Update quantity of a cart item 
//@route PUT api/v1/cart/:itemId
//@access Private
exports.updateCartItem = asyncHandler(async (req, res, next) => {

    const { quantity, size } = req.body;

    if(!quantity || !size) throw new ErrorResponse('provide a size and quantity', 400);

    const user = await User.findById(req.user._id);
    const product = await Product.findById(req.params.productId);

    if(!product) throw new ErrorResponse('product does not exist', 404);
    
    const cartItem = user.cart.find(item => item.product.equals(req.params.productId) && item.size === size);

    if(!cartItem) 
        throw new ErrorResponse('Item does not exist in cart', 400);
    else{
        cartItem.quantity = quantity;
    }

    user.cartLastUpdated = new Date();

    await user.save();
    
    res.status(200).json({
        success: true,
        data: user.cart,
    });
});


//@desc removes a cart item from cart 
//@route DELETE api/v1/cart/:productId?size=x
//@access Private
exports.removeCartItem = asyncHandler(async (req, res, next) => {

    const { size } = req.query;
    if(!size) throw new ErrorResponse('provide a size', 400);

    const user = await User.findById(req.user._id);
    const product = await Product.findById(req.params.productId);

    if(!product) throw new ErrorResponse('product does not exist', 404);

    const cartItem = user.cart.find(item => item.product.equals(req.params.productId) && item.size === size);
    
    if(!cartItem) 
        throw new ErrorResponse('Item does not exist in cart', 400);
    else{
        user.cart = user.cart.filter(element => !(element.product.equals(req.params.productId) && element.size === size));
    }

    user.cartLastUpdated = new Date(); 
    await user.save();

    res.status(200).json({
        success: true,
        data: user.cart,
    });
    
});

//@desc gets all cart items 
//@route GET api/v1/cart
//@access Private
exports.getCartItems = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id).populate('cart.product');

    user.cartLastUpdated = new Date(); 
    await user.save();

    res.status(200).json({
        success: true,
        data: {
            cart: user.cart,
            cartTotal: user.cartTotal
        } 
    });

});

//@desc Deletes all cart items 
//@route DELETE api/v1/cart
//@access Private
exports.deleteCart = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user._id);

    user.cart = []; 
    user.cartLastUpdated = new Date();
    await user.save();
    
    res.status(200).json({
        success: true,
        data: {},
    });

});