const mongoose = require("mongoose");
const ShippingCost = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    firstName: {
      type: String,
      required: [true, "Please add your firstname"],
    },
    lastName: {
      type: String,
      required: [true, "Please add your lastname"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Please add a phone number"],
      minlength: 10,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
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
        //price: {  type: Number, required: true }
      },
    ],
    shippingAddress: {
      state: { type: String, required: true },
      address: { type: String },
    },
    shippingType: {
      type: String,
      enum: ["Stopdesk", "Home"],
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 0.0,
    },
    total: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Failed"],
      required: true,
      default: "Processing",
    },
    deliveredAt: {
      type: Date,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.pre("save", async function (next) {
  if (!this.isModified("items")) return next();

  await this.populate("items.product");

  this.total = this.items.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  this.total += this.shippingCost;

  next();
});

OrderSchema.pre("validate", function (next) {
  this._needsIdAssignment = this.isNew && !this.id;
  next();
});

OrderSchema.post("save", async function (doc, next) {
  if (!doc._needsIdAssignment) return next();

  try {
    const Counter = mongoose.model("Counter"); // avoid circular ref
    const counter = await Counter.findByIdAndUpdate(
      { _id: "order" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    doc.id = counter.seq;
    await doc.constructor.findByIdAndUpdate(doc._id, { id: counter.seq });
    next();
  } catch (err) {
    next(err);
  }
});

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", CounterSchema);

module.exports = mongoose.model("Order", OrderSchema);
