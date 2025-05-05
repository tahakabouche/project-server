const { asyncHandler } = require("../middleware");
const { Product, ClothingProduct, ShoeProduct } = require("../models");
const ErrorResponse = require("../utils/errorresponse.js");
const path = require("path");
const fs = require("fs");

//@desc Gets all products from database
//@route GET /api/v1/products
//@access Public
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc Gets a single product with a given id from database
//@route GET /api/v1/products/:id
//@access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new ErrorResponse("id not found in database", 404);

  res.status(200).json({
    success: true,
    data: product,
  });
});

//@desc creates a product then pushes it to database
//@route POST /api/v1/products
//@access Private
exports.createProduct = asyncHandler(async (req, res, next) => {
  let product;
  const productType = req.body.productType;

  if (productType === "shoe") {
    req.body.productType = undefined;
    product = await ShoeProduct.create(req.body);
  } else if (productType === "clothing") {
    req.body.productType = undefined;
    product = await ClothingProduct.create(req.body);
  } else {
    throw new ErrorResponse("Invalid product type", 400);
  }

  if (!product) throw new ErrorResponse("Resource could not be created", 500);

  res.status(201).json({
    success: true,
    data: product,
  });
});

//@desc updates a product with a given id from database
//@route PUT /api/v1/products/:id
//@access Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) throw new ErrorResponse("id not found in database", 404);

  res.status(200).json({
    success: true,
    data: product,
  });
});
//@desc deletes a product with a given id from database
//@route DELETE /api/v1/products/:id
//@access Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) throw new ErrorResponse("id not found in database", 404);

  res.status(200).json({
    success: true,
    data: [],
  });
});

//@desc Uploads an image to to the file system and stores the file name in the database
//@route PUT /api/v1/products/:id/photo
//@access Private/admin
exports.uploadProductPhoto = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new ErrorResponse("id not found in database", 404);
  if (!req.files) throw new ErrorResponse("please upload a file", 400);

  const file = req.files.file;

  // if the file name already exist 
  if (product.images.includes(file.name)) { 
      res.status(200).json({
      success: true,
      data: file.name,
      }); 
      return next();
  }
  
  if (!file.mimetype.startsWith("image"))
    throw new ErrorResponse("please upload an image file", 400);

  if (file.size > process.env.MAX_FILE_UPLOAD)
    throw new ErrorResponse(
      `please upload an image less than ${MAX_FILE_UPLOAD / 1024 / 1024}mb`,
      400
    );

  if (product.images.length > 3)
    throw new ErrorResponse("can not upload more than 4 photos for a product");

  /*
  file.name = `photo_${product.images.length + 1}_${product._id}${
    path.parse(file.name).ext
  }`;
  */

  product.images.push(file.name);

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (error) => {
    if (error) return next(error);
    await product.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });

  });
});

//@desc delete an image
//@route DELETE /api/v1/products/:id/:filename
//@access Private/admin
exports.deleteProductPhoto = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  console.log(typeof req.params.filename);

  if (!product) throw new ErrorResponse("id not found in database", 404);
  if (!product.images.includes(req.params.filename))
    throw new ErrorResponse("image does not exist", 404);

  const path = `${process.env.FILE_UPLOAD_PATH}/${req.params.filename}`;

  fs.unlink(path, (err) => {
    if (err) {
      return next(err);
    } else {
      console.log("File deleted successfully");
    }
  });

  product.images = product.images.filter(
    (image) => image !== req.params.filename
  );
  await product.save();
  res.status(200).json({
    success: true,
  });
});

//@desc Deletes all images in the file system and the file names in the database
//@route DELETE /api/v1/products/:id/photo
//@access Private/admin
exports.deleteProductPhotos = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new ErrorResponse("id not found in database", 404);

  product.images.forEach((imageName) => {
    const path = `${process.env.FILE_UPLOAD_PATH}/${imageName}`;
    fs.unlink(path, (err) => {
      if (err) {
        return next(err);
      } else {
        console.log("File deleted successfully");
      }
    });
  });

  product.images = [];
  await product.save();

  res.status(200).json({
    success: true,
  });
});
