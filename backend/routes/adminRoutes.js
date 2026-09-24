import express from "express";
import { getAdminProfile, getNotificationSettings, loginAdmin, updateAdminProfile, updateNotificationSettings } from "../controllers/adminController.js";
import { protect } from "../middleware/Auth.js";
import { createCloudinaryUploadSignature, getAdminSiteContent, updateAdminSiteContent } from "../controllers/siteContentController.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/profile", protect, getAdminProfile);
router.patch("/profile", protect, updateAdminProfile);
router.get("/notification-settings", protect, getNotificationSettings);
router.put("/notification-settings", protect, updateNotificationSettings);
router.get("/site-content", protect, getAdminSiteContent);
router.patch("/site-content", protect, updateAdminSiteContent);
router.post("/media/signature", protect, createCloudinaryUploadSignature);

export default router;
