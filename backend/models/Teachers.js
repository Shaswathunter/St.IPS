import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  name: String,
  subject: String,
  image: String,
});

export default mongoose.model("Teacher", teacherSchema);