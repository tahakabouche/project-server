const mongoose = require('mongoose');
const Product = require('./Product');

const ClothingSchema = new mongoose.Schema({
    sizes: [{
      size: {
        type: String,
        enum: ["XS", "S", "M", "L", "XL", "XXL", "3XL"], 
        required: true
      },
      quantity: { type: Number, required: true, min: 0 }
    }],
 
  });
  
  // Create and export the clothing discriminator model
  const ClothingProduct = Product.discriminator('Clothing', ClothingSchema);
  
  module.exports = ClothingProduct;