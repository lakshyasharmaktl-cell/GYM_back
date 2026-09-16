/**
 * 🌱 Seed Script — Default GYM Membership Plans
 * Run: node src/seed/seedPlans.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Membership from "../models/Membership.js";

dotenv.config();

const defaultPlans = [
  {
    planName: "Full Gym — Monthly",
    durationInDays: 30,
    price: 1500,
    description: "Full access to gym equipment, weights, cardio & group classes",
  },
  {
    planName: "Full Gym — Quarterly",
    durationInDays: 90,
    price: 4000,
    description: "3-month full gym access with 11% savings",
  },
  {
    planName: "Full Gym — Half Yearly",
    durationInDays: 180,
    price: 7500,
    description: "6-month full gym access with 17% savings",
  },
  {
    planName: "Full Gym — Yearly",
    durationInDays: 365,
    price: 12000,
    description: "Annual full gym membership with maximum savings",
  },
  {
    planName: "Cardio Only — Monthly",
    durationInDays: 30,
    price: 800,
    description: "Access to treadmills, cycles, elliptical & cardio equipment",
  },
  {
    planName: "Strength Training — Monthly",
    durationInDays: 30,
    price: 1200,
    description: "Access to free weights, machines & strength equipment",
  },
  {
    planName: "Personal Training — Monthly",
    durationInDays: 30,
    price: 3500,
    description: "1-on-1 personal trainer sessions, 12 sessions/month",
  },
  {
    planName: "Student Plan — Monthly",
    durationInDays: 30,
    price: 600,
    description: "Discounted full gym access for students (ID required)",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await Membership.countDocuments();
    if (existing > 0) {
      console.log(`⚠️  ${existing} plans already exist. Skipping seed.`);
      console.log("   To re-seed, delete existing plans first.");
      process.exit(0);
    }

    const created = await Membership.insertMany(defaultPlans);
    console.log(`\n🎉 Successfully seeded ${created.length} membership plans:\n`);
    created.forEach((p) => console.log(`   ✓ ${p.planName} — ₹${p.price} / ${p.durationInDays} days`));
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
