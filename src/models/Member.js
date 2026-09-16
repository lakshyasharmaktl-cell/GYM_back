import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    memberId: { type: String, required: true, unique: true }, // custom generated ID
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    age: { type: Number },
    photo: { type: String }, // cloudinary url

    membership: {
      plan: { type: mongoose.Schema.Types.ObjectId, ref: "Membership" },
      startDate: { type: Date, default: Date.now },
      endDate: { type: Date },
      totalFee: { type: Number, default: 0 },
      amountPaid: { type: Number, default: 0 },
      dueAmount: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ["Active", "Expired", "Pending"],
        default: "Active",
      },
    },

    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", memberSchema);
export default Member;