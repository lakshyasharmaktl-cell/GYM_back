import Member from "../models/Member.js";
import Membership from "../models/Membership.js";
import Payment from "../models/Payment.js";
import generateMemberId from "../utils/generateMemberId.js";
import { calculateDue, calculateEndDate } from "../utils/calculateDue.js";

// @desc Add new member (Admin only)
export const addMember = async (req, res) => {
  try {
    const { name, phone, email, address, gender, age, planId, amountPaid } = req.body;

    const plan = await Membership.findById(planId);
    if (!plan) return res.status(404).json({ message: "Membership plan not found" });

    const memberId = await generateMemberId();
    const startDate = new Date();
    const endDate = calculateEndDate(startDate, plan.durationInDays);
    const paidAmount = Number(amountPaid) || 0;
    const dueAmount = calculateDue(plan.price, paidAmount);

    const member = await Member.create({
      memberId,
      name,
      phone,
      email,
      address,
      gender,
      age,
      photo: req.file ? req.file.path : "",
      membership: {
        plan: plan._id,
        startDate,
        endDate,
        totalFee: plan.price,
        amountPaid: paidAmount,
        dueAmount,
        status: dueAmount > 0 ? "Pending" : "Active",
      },
      createdBy: req.admin._id,
    });

    // Log initial payment if any
    if (paidAmount > 0) {
      await Payment.create({
        member: member._id,
        amount: paidAmount,
        paymentMode: req.body.paymentMode || "Cash",
        note: "Initial payment on joining",
        receivedBy: req.admin._id,
      });
    }

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all members
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("membership.plan", "planName price durationInDays")
      .sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single member by ID
export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate(
      "membership.plan",
      "planName price durationInDays"
    );
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update member details
export const updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const { name, phone, email, address, gender, age } = req.body;

    member.name = name || member.name;
    member.phone = phone || member.phone;
    member.email = email || member.email;
    member.address = address || member.address;
    member.gender = gender || member.gender;
    member.age = age || member.age;

    if (req.file) member.photo = req.file.path;

    const updated = await member.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Renew / change membership plan
export const renewMembership = async (req, res) => {
  try {
    const { planId, amountPaid, paymentMode } = req.body;

    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const plan = await Membership.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const startDate = new Date();
    const endDate = calculateEndDate(startDate, plan.durationInDays);
    const paidAmount = Number(amountPaid) || 0;
    const dueAmount = calculateDue(plan.price, paidAmount);

    member.membership = {
      plan: plan._id,
      startDate,
      endDate,
      totalFee: plan.price,
      amountPaid: paidAmount,
      dueAmount,
      status: dueAmount > 0 ? "Pending" : "Active",
    };

    await member.save();

    if (paidAmount > 0) {
      await Payment.create({
        member: member._id,
        amount: paidAmount,
        paymentMode: paymentMode || "Cash",
        note: "Membership renewal payment",
        receivedBy: req.admin._id,
      });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete member
export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    await member.deleteOne();
    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get members with pending dues
export const getDueMembers = async (req, res) => {
  try {
    const members = await Member.find({ "membership.dueAmount": { $gt: 0 } }).populate(
      "membership.plan",
      "planName price"
    );
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};