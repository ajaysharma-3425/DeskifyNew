import mongoose, { Schema, models } from "mongoose";

const OrderItemSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [OrderItemSchema],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    cancelReason: {
      type: String,
      default: "",
    },

    cancelledBy: {
      type: String,
      enum: ["user", "admin"],
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
    },
    // Isse apne existing Order model mein add karein
    paymentMethod: { type: String, enum: ["COD", "ONLINE"], default: "COD" },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    transactionId: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.Order || mongoose.model("Order", OrderSchema);
