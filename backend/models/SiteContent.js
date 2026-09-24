import mongoose from "mongoose";
import { DEFAULT_SITE_CONTENT, SITE_KEY } from "../config/siteContent.js";

const siteContentSchema = new mongoose.Schema(
  {
    siteKey: {
      type: String,
      required: true,
      unique: true,
      default: SITE_KEY,
      index: true,
    },
    site: {
      type: mongoose.Schema.Types.Mixed,
      default: () => structuredClone(DEFAULT_SITE_CONTENT.site),
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: () => structuredClone(DEFAULT_SITE_CONTENT.content),
    },
    visibility: {
      type: mongoose.Schema.Types.Mixed,
      default: () => structuredClone(DEFAULT_SITE_CONTENT.visibility),
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true, minimize: false },
);

export default mongoose.model("SiteContent", siteContentSchema);
