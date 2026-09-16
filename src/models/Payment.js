import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    amount: { type: Number, required: true },
    paymentMode: {
      type: String,
      enum: ["Cash", "Online", "Card", "UPI"],
      default: "Cash",
    },
    paymentDate: { type: Date, default: Date.now },
    note: { type: String },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;