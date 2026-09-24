import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },

    classApplied: {
      type: String,
      required: [true, "Class is required"],
    },

    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Visit Scheduled", "Admitted", "Closed"],
      default: "New",
    },
    emailNotificationStatus: {
      type: String,
      enum: ["sent", "failed", "not-configured"],
      default: "not-configured",
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
