const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { type } = require("os");
const { profile } = require("console");

const UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please add your firstname"],
    maxlength: [50, "firstname cannot be more than 50 characters"],
  },

  lastname: {
    type: String,
    required: [true, "Please add your lastname"],
    maxlength: [50, "lastname cannot be more than 50 characters"],
  },

  email: {
    type: String,
    unique: true,
    required: [true, "Please add an email"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },

  profilePicture: {
    type: String,
    maxlength: 100,
    default: "default-pfp.jpg",
  },

  phone: {
    type: String,
    minlength: 10
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },

  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 0,
        required: true,
      },
      size: {
        type: String,
        enum: [
          "XS",
          "S",
          "M",
          "L",
          "XL",
          "XXL",
          "3XL",
          "36",
          "37",
          "38",
          "39",
          "40",
          "41",
          "42",
          "43",
          "44",
          "45",
          "46",
        ],
        required: true,
      },
    },
  ],

  cartTotal: {
    type: Number,
    default: 0,
  },

  cartLastUpdated: {
    type: Date,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,

  lastLogin: {
    type: Date,
    default: Date.now,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("cart")) return next();

  await this.populate("cart.product");

  this.cartTotal = this.cart.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  next();
});

// Encrypt password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Generate and hash password token
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hash token and set to resetPasswordToken field in db
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // set exipre to 10min
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

UserSchema.methods.checkCartExpiration = async function () {
  const EXPIRATION_MINUTES = 120;
  const now = new Date();

  if (
    this.cartLastUpdated && now - this.cartLastUpdated > EXPIRATION_MINUTES * 60 * 1000
  ) {
    this.cart = [];
    this.cartLastUpdated = now;
    await this.save();
  }
};

module.exports = mongoose.model("User", UserSchema);
