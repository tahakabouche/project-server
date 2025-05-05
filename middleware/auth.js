const ErrorResponse = require("../utils/errorresponse");
const jwt = require("jsonwebtoken");
const asyncHandler = require("./asynchandler");
const {User} = require("../models");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

    //if(req.cookies.token) token = req.cookies.token;

  if (!token)
    throw new ErrorResponse("not authorized to access this route", 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id);

    if(!user) throw new ErrorResponse('not authorized to access this route', 401);
    
    user.checkCartExpiration();
    
    req.user = user;
     
    next();
  } catch (error) {
    next(new ErrorResponse(error.message , 401));
  }
});

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new ErrorResponse(
          `the role ${req.user.role} is unauthorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Protect routes
exports.watch = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ){
    token = req.headers.authorization.split(" ")[1];
  }

    //if(req.cookies.token) token = req.cookies.token;

  try {
    if(token){
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      const user = await User.findById(decoded.id);
  
      if(!user) throw new ErrorResponse('not authorized to access this route', 401);
      
      user.checkCartExpiration();
      
      req.user = user;
    }
         
    next();
  } catch (error) {
    next(new ErrorResponse(error.message , 401));
  }
});
