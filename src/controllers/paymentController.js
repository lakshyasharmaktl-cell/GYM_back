import Payment from "../models/Payment.js";
import Member from "../models/Member.js";
import { calculateDue } from "../utils/calculateDue.js";

// @desc Add a payment (clear due) for a member
export const addPayment = async (req, res) => {
  try {
    const { amount, paymentMode, note } = req.body;
    const member = await Member.findById(req.params.memberId);

    if (!member) return res.status(404).json({ message: "Member not found" });

    const payAmount = Number(amount);
    member.membership.amountPaid += payAmount;
    member.membership.dueAmount = calculateDue(
      member.membership.totalFee,
      member.membership.amountPaid
    );
    member.membership.status = member.membership.dueAmount > 0 ? "Pending" : "Active";

    await member.save();

    const payment = await Payment.create({
      member: member._id,
      amount: payAmount,
      paymentMode: paymentMode || "Cash",
      note,
      receivedBy: req.admin._id,
    });

    res.status(201).json({ payment, member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get payment history of a member
export const getMemberPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ member: req.params.memberId }).sort({
      createdAt: -1,
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all payments (overall records)
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("member", "name memberId phone")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};