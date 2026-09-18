/**
 * One-time cleanup: delete duplicate payment for GYM0002 (mohit)
 * Removes the "Online" ₹5000 entry WITHOUT reversing member's amountPaid
 * Run: node src/seed/fixDuplicatePayment.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Payment from "../models/Payment.js";
import Member from "../models/Member.js";

dotenv.config();

async function fix() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  // Find GYM0002 member
  const member = await Member.findOne({ memberId: "GYM0002" });
  if (!member) { console.log("❌ GYM0002 not found"); process.exit(1); }

  console.log(`👤 Member: ${member.name} (${member.memberId})`);
  console.log(`   Current amountPaid: ₹${member.membership.amountPaid}`);
  console.log(`   Current dueAmount:  ₹${member.membership.dueAmount}\n`);

  // Find all payments for this member
  const allPayments = await Payment.find({ member: member._id }).sort({ createdAt: 1 });
  console.log(`📋 All payments (${allPayments.length} records):`);
  allPayments.forEach((p, i) => {
    console.log(`   ${i + 1}. ₹${p.amount} | ${p.paymentMode} | "${p.note || "—"}" | ${new Date(p.createdAt).toLocaleString()}`);
  });

  // Find the duplicate: Online payment with no note (the accidental one)
  const duplicate = allPayments.find(p => p.paymentMode === "Online" && !p.note);
  
  if (!duplicate) {
    console.log("\n✅ No duplicate found. Already clean!");
    process.exit(0);
  }

  console.log(`\n🗑️  Deleting duplicate: ₹${duplicate.amount} ${duplicate.paymentMode} (no note)`);
  await Payment.findByIdAndDelete(duplicate._id);
  console.log("✅ Duplicate payment record deleted.");
  console.log("ℹ️  Member's amountPaid NOT changed (still ₹10,000 — correct!)");

  const remaining = await Payment.find({ member: member._id });
  console.log(`\n📋 Remaining payments (${remaining.length} records):`);
  remaining.forEach((p, i) => {
    console.log(`   ${i + 1}. ₹${p.amount} | ${p.paymentMode} | "${p.note || "—"}"`);
  });

  process.exit(0);
}

fix().catch(e => { console.error("❌", e.message); process.exit(1); });
