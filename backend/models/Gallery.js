import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  imageUrl: String,
});

export default mongoose.model("Gallery", gallerySchema);