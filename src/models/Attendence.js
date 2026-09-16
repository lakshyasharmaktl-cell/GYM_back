import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    member: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["Present", "Absent"], default: "Present" },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;