const errorHandler = (error, req, res, next) => {
  console.log(error);
  console.log(error.name);

  if (error.name === "ErrorResponse") {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  } else {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  next();
};

module.exports = errorHandler;
