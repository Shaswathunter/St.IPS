import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginAdmin = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: "Email and password are required" });

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ msg: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) return res.status(500).json({ msg: "Admin login is not configured" });
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("name email");
    if (!admin) return res.status(404).json({ msg: "Admin account not found" });
    res.json({ name: admin.name || "School Admin", email: admin.email });
  } catch {
    res.status(500).json({ msg: "Could not load admin profile" });
  }
};

export const updateAdminProfile = async (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : undefined;
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : undefined;
  const currentPassword = typeof req.body.currentPassword === "string" ? req.body.currentPassword : "";
  const newPassword = typeof req.body.newPassword === "string" ? req.body.newPassword : "";

  if (name !== undefined && (!name || name.length > 80)) return res.status(400).json({ msg: "Name must be between 1 and 80 characters" });
  if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ msg: "Enter a valid email address" });
  if (newPassword && newPassword.length < 8) return res.status(400).json({ msg: "New password must be at least 8 characters" });
  if (newPassword && newPassword.length > 128) return res.status(400).json({ msg: "New password must be 128 characters or fewer" });

  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ msg: "Admin account not found" });

    const changesIdentity = (email !== undefined && email !== admin.email) || Boolean(newPassword);
    if (changesIdentity) {
      if (!currentPassword) return res.status(400).json({ msg: "Enter your current password to change your email or password" });
      if (!(await bcrypt.compare(currentPassword, admin.password))) return res.status(401).json({ msg: "Current password is incorrect" });
    }

    if (name !== undefined) admin.name = name;
    if (email !== undefined) admin.email = email;
    if (newPassword) admin.password = await bcrypt.hash(newPassword, 12);
    await admin.save();
    res.json({ name: admin.name || "School Admin", email: admin.email });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ msg: "That email address is already used by an admin account" });
    if (error.name === "ValidationError") return res.status(400).json({ msg: "Check the profile details and try again" });
    console.error("Admin profile update failed:", error.name, error.code || "no-code");
    res.status(500).json({ msg: "Could not save the admin profile" });
  }
};

export const getNotificationSettings = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("notificationEmail");
    if (!admin) return res.status(404).json({ msg: "Admin account not found" });
    res.json({ recipientEmail: admin.notificationEmail || "", senderConfigured: Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) });
  } catch {
    res.status(500).json({ msg: "Could not load email settings" });
  }
};

export const updateNotificationSettings = async (req, res) => {
  const recipientEmail = String(req.body.recipientEmail || "").trim().toLowerCase();
  if (recipientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    return res.status(400).json({ msg: "Enter a valid recipient email address" });
  }
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ msg: "Admin account not found" });
    admin.notificationEmail = recipientEmail;
    await admin.save();
    res.json({ recipientEmail: admin.notificationEmail || "", senderConfigured: Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) });
  } catch (error) {
    console.error("Notification settings save failed:", error.name, error.code || "no-code");
    if (error.name === "ValidationError") return res.status(400).json({ msg: "Enter a valid recipient email address" });
    res.status(500).json({ msg: "Email address could not be saved. Check the backend database connection and retry." });
  }
};
