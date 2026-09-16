import Attendance from "../models/Attendence.js";

// @desc Mark attendance
export const markAttendance = async (req, res) => {
  try {
    const { memberId, status } = req.body;

    const attendance = await Attendance.create({
      member: memberId,
      status: status || "Present",
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get attendance of a specific member
export const getMemberAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ member: req.params.memberId }).sort({
      date: -1,
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get today's attendance (all members)
export const getTodayAttendance = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const records = await Attendance.find({
      date: { $gte: start, $lte: end },
    }).populate("member", "name memberId phone");

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};