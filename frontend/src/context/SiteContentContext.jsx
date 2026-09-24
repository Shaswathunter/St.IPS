import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { defaultSiteContent } from "../data/defaultSiteContent";
import { ensureGalleryPhotoSlots } from "../galleryUtils";
import { API_BASE_URL } from "../config/api";

const API = API_BASE_URL;
const SiteContentContext = createContext(defaultSiteContent);
const clone = (value) => JSON.parse(JSON.stringify(value));
function merge(base, saved) {
  if (saved == null) return clone(base);
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return saved;
  if (!base || typeof base !== "object" || Array.isArray(base)) return saved;
  return Object.fromEntries([...new Set([...Object.keys(base), ...Object.keys(saved)])].map((key) => [key, merge(base[key], saved[key])]));
}

export function SiteContentProvider({ children }) {
  const [siteContent, setSiteContent] = useState(defaultSiteContent);
  useEffect(() => {
    let active = true;
    axios.get(`${API}/site-content`, { timeout: 8000 }).then(({ data }) => {
      if (active) setSiteContent({ site: merge(defaultSiteContent.site, data.site), content: ensureGalleryPhotoSlots(merge(defaultSiteContent.content, data.content)), visibility: merge(defaultSiteContent.visibility, data.visibility) });
    }).catch(() => { /* Keep the bundled school content available if the API is offline. */ });
    return () => { active = false; };
  }, []);
  return <SiteContentContext.Provider value={siteContent}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() { return useContext(SiteContentContext); }
