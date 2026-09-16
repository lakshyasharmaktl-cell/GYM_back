import Membership from "../models/Membership.js";

// @desc Create membership plan
export const createMembership = async (req, res) => {
  try {
    const { planName, durationInDays, price, description } = req.body;

    const membership = await Membership.create({
      planName,
      durationInDays,
      price,
      description,
    });

    res.status(201).json(membership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all membership plans
export const getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update membership plan
export const updateMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) return res.status(404).json({ message: "Plan not found" });

    Object.assign(membership, req.body);
    const updated = await membership.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete membership plan
export const deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) return res.status(404).json({ message: "Plan not found" });

    await membership.deleteOne();
    res.json({ message: "Membership plan deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};