import Member from "../models/Member.js";
import Payment from "../models/Payment.js";
import Expense from "../models/Expense.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ "membership.status": "Active" });
    const pendingDueMembers = await Member.countDocuments({
      "membership.dueAmount": { $gt: 0 },
    });

    const totalDueAmountAgg = await Member.aggregate([
      { $group: { _id: null, total: { $sum: "$membership.dueAmount" } } },
    ]);
    const totalDueAmount = totalDueAmountAgg[0]?.total || 0;

    const totalRevenueAgg = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const totalExpenseAgg = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalExpense = totalExpenseAgg[0]?.total || 0;

    res.json({
      totalMembers,
      activeMembers,
      pendingDueMembers,
      totalDueAmount,
      totalRevenue,
      totalExpense,
      netProfit: totalRevenue - totalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};