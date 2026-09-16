import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    planName: { type: String, required: true }, // e.g. "Monthly", "Quarterly", "Yearly"
    durationInDays: { type: Number, required: true }, // 30, 90, 365
    price: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

const Membership = mongoose.model("Membership", membershipSchema);
export default Membership;