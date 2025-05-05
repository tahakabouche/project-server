const mongoose = require("mongoose");
const Product = require("./Product");

const ShoeSchema = new mongoose.Schema({
  sizes: [
    {
      size: {
        type: String,
        enum: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
        required: true,
      },
      quantity: { type: Number, required: true, min: 0 },
    },
  ],
});

const ShoeProduct = Product.discriminator("Shoe", ShoeSchema);

module.exports = ShoeProduct;
