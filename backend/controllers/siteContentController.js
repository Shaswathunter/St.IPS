import { createHash } from "node:crypto";
import SiteContent from "../models/SiteContent.js";
import { DEFAULT_SITE_CONTENT, SITE_KEY, mergeContent, validateSiteContentPatch } from "../config/siteContent.js";

async function getOrCreateSiteContent() {
  let record = await SiteContent.findOne({ siteKey: SITE_KEY }).lean();
  if (record) return record;

  try {
    record = await SiteContent.create({ siteKey: SITE_KEY, ...structuredClone(DEFAULT_SITE_CONTENT) });
    return record.toObject();
  } catch (error) {
    if (error.code !== 11000) throw error;
    return SiteContent.findOne({ siteKey: SITE_KEY }).lean();
  }
}

function publicShape(record, { includeScheduledNotices = false } = {}) {
  const content = structuredClone(record.content ?? {});
  if (!includeScheduledNotices && Array.isArray(content.home?.noticeBoard?.items)) {
    const now = Date.now();
    content.home.noticeBoard.items = content.home.noticeBoard.items.filter((item) => {
      if (!item || typeof item !== "object") return false;
      if (!item.publishAt) return true;
      const publishAt = Date.parse(item.publishAt);
      return Number.isFinite(publishAt) && publishAt <= now;
    });
  }
  return {
    site: record.site,
    content,
    visibility: record.visibility,
    updatedAt: record.updatedAt ?? null,
  };
}

export async function getPublicSiteContent(_req, res) {
  try {
    const record = await getOrCreateSiteContent();
    res.json(publicShape(record));
  } catch {
    res.status(503).json({ msg: "School site content is temporarily unavailable" });
  }
}

export async function getAdminSiteContent(_req, res) {
  try {
    const record = await getOrCreateSiteContent();
    res.json(publicShape(record, { includeScheduledNotices: true }));
  } catch {
    res.status(503).json({ msg: "Could not load school site content" });
  }
}

export async function updateAdminSiteContent(req, res) {
  try {
    validateSiteContentPatch(req.body);
  } catch (error) {
    return res.status(400).json({ msg: error.message || "Invalid content update" });
  }

  try {
    const current = await getOrCreateSiteContent();
    const updates = {};
    for (const field of ["site", "content", "visibility"]) {
      if (req.body[field] !== undefined) updates[field] = mergeContent(current[field] ?? {}, req.body[field]);
    }

    const record = await SiteContent.findOneAndUpdate(
      { siteKey: SITE_KEY },
      { $set: { ...updates, updatedBy: req.admin.id } },
      { new: true, runValidators: true },
    ).lean();

    res.json(publicShape(record, { includeScheduledNotices: true }));
  } catch {
    res.status(500).json({ msg: "Could not save school site content" });
  }
}

export async function createCloudinaryUploadSignature(_req, res) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(503).json({ msg: "Cloudinary is not configured on the server" });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const params = {
    allowed_formats: "jpg,jpeg,png,webp,avif",
    folder: "stips/site-content",
    timestamp: String(timestamp),
  };
  const signatureInput = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  const signature = createHash("sha1")
    .update(`${signatureInput}${apiSecret}`)
    .digest("hex");

  res.json({
    cloudName,
    apiKey,
    timestamp,
    folder: params.folder,
    allowedFormats: params.allowed_formats,
    resourceType: "image",
    signature,
  });
}
