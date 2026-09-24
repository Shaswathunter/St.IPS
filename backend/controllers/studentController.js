import Student from "../models/Student.js";
import Admin from "../models/Admin.js";
import nodemailer from "nodemailer";

const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));

const notifySchool = async (student) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return false;
  const admin = await Admin.findOne({ notificationEmail: { $type: "string", $ne: "" } }).select("notificationEmail");
  if (!admin?.notificationEmail) return false;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, "") },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  await transporter.sendMail({
    from: `ST.IPS Admissions <${process.env.GMAIL_USER}>`,
    to: admin.notificationEmail,
    subject: `New admission enquiry: ${student.name}`,
    text: ["A new admission enquiry was submitted on the ST.IPS website.", `Name: ${student.name}`, `Email: ${student.email}`, `Phone: ${student.phone}`, `Class: ${student.classApplied || "Not provided"}`, `Message: ${student.message || "Not provided"}`, `Received: ${student.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`].join("\n"),
    html: `<h2>New admission enquiry</h2><p>A new form was submitted on the ST.IPS website.</p><table>${[["Name", student.name], ["Email", student.email], ["Phone", student.phone], ["Class", student.classApplied || "Not provided"], ["Message", student.message || "Not provided"], ["Received", student.createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })]].map(([label, value]) => `<tr><th align="left" style="padding:8px">${label}</th><td style="padding:8px">${escapeHtml(value)}</td></tr>`).join("")}</table>`,
  });
  return true;
};

export const createStudent = async (req, res) => {
  try {
    const { name, email, phone, classApplied, message } = req.body;
    const student = await Student.create({ name, email, phone, classApplied, message, status: "New" });
    let emailNotificationSent = false;
    try {
      emailNotificationSent = await notifySchool(student);
      student.emailNotificationStatus = emailNotificationSent ? "sent" : "not-configured";
    } catch (mailError) {
      // The application has already been saved; do not ask the family to submit it again.
      student.emailNotificationStatus = "failed";
      console.error("Admission email notification failed:", mailError.code || mailError.name || "mail error");
    }
    await student.save();
    res.status(201).json({ ...student.toObject(), emailNotificationSent });
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ msg: Object.values(err.errors).map((item) => item.message).join(". ") });
    if (err.code === 11000) return res.status(409).json({ msg: "An enquiry with this email address has already been submitted." });
    res.status(500).json({ msg: "Could not save the admission enquiry" });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ msg: "Could not load applications" });
  }
};

export const updateStudentStatus = async (req, res) => {
  const allowedStatuses = ["New", "Contacted", "Visit Scheduled", "Admitted", "Closed"];
  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({ msg: "Choose a valid application status" });
  }
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ msg: "Application not found" });
    res.json(student);
  } catch {
    res.status(400).json({ msg: "Could not update application" });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ msg: "Application not found" });
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
