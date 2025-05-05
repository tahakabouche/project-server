const mongoose = require("mongoose");
const slugify = require("slugify");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      maxlength: [150, "Name cannot be more than 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [400, "Name cannot be more than 400 characters"],
    },
    slug: String,
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: [
        "Jackets",
        "T-shirts",
        "Sweatshirts",
        "Hoodies",
        "Jeans",
        "Sweatpants",
        "Shorts",
        "Shoes",
      ],
    },
    images: {
      type: [
        {
          type: String,
          maxlength: 100,
        },
      ],
      validate: {
        validator: function (arr) {
          return arr.length <= 4;
        },
        message: "You can only have up to 4 images.",
      },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    productType: { type: String, enum: ["shoe", "clothing"], required: true },
  },
  {
    discriminatorKey: "productType",
    collection: "products",
  }
);

ProductSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
