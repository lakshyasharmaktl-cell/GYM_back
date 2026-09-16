import Member from "../models/Member.js";

// Generates ID like GYM0001, GYM0002...
const generateMemberId = async () => {
  const count = await Member.countDocuments();
  const nextNumber = (count + 1).toString().padStart(4, "0");
  return `GYM${nextNumber}`;
};

export default generateMemberId;