import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password || password.length < 8) {
      throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 8 characters) in backend/.env first.");
    }
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash(password, 12);

    await Admin.findOneAndUpdate({ email }, {
      email,
      password: hashedPassword,
    }, { upsert: true, new: true, runValidators: true });

    console.log(`Admin account ready for ${email}`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
