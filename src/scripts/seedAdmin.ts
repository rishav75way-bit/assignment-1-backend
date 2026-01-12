import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "../models/user.model";
import { hashPassword } from "../utils/password";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URL as string);

  const email = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || "Admin@123";

  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = "admin";
    await existing.save();
    console.log(" Admin role ensured for:", email);
  } else {
    const hashed = await hashPassword(password);
    await User.create({ email, password: hashed, role: "admin" });
    console.log(" Admin created:", email, "password:", password);
  }

  await mongoose.disconnect();
};

run().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
