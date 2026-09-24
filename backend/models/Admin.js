import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: 80,
    default: "School Admin",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  notificationEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: "",
  },
});

export default mongoose.model("Admin", adminSchema);
