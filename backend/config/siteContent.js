export const SITE_KEY = "stips-main";

export const SITE_SECTIONS = Object.freeze({
  home: [
    "hero",
    "teachers",
    "noticeBoard",
    "principal",
    "aboutSchool",
    "features",
    "academics",
    "facilities",
    "studentLife",
    "campusTour",
    "gallery",
    "achievements",
    "newsEvents",
    "testimonials",
  ],
  about: ["hero", "mission", "values", "community"],
  admissions: ["intro", "form", "contactDetails"],
  shared: ["header", "footer"],
});

export const DEFAULT_SITE_CONTENT = Object.freeze({
  site: {
    name: "ST.IPS",
    tagline: "Learn with purpose. Lead with confidence.",
    address: "Rajnagar, Azizpur, Agra",
    phone: "+91 96348 46096",
    email: "",
    logoUrl: "",
    principalName: "Mr. Rajesh Kumar Gautam",
    mapUrl: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      youtube: "",
      linkedin: "",
    },
  },
  content: {
    home: {},
    about: {},
    admissions: {},
    shared: {},
  },
  visibility: Object.fromEntries(
    Object.entries(SITE_SECTIONS).map(([page, sections]) => [
      page,
      Object.fromEntries(sections.map((section) => [section, true])),
    ]),
  ),
});

const SITE_FIELDS = new Set([
  "name",
  "tagline",
  "address",
  "phone",
  "email",
  "logoUrl",
  "principalName",
  "mapUrl",
  "socialLinks",
]);
const SOCIAL_FIELDS = new Set(["facebook", "instagram", "youtube", "linkedin"]);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateImageAddress(value, path) {
  if (typeof value !== "string" || value.length === 0) return;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error("Only HTTP(S) image URLs are allowed");
    }
  } catch (error) {
    if (value.startsWith("/") && !value.startsWith("//")) return;
    throw new Error(`${path} must be an HTTP(S) URL or a site-relative path`);
  }
}

function validateTree(value, path = "content", depth = 0) {
  if (depth > 10) throw new Error(`${path} is nested too deeply`);
  if (typeof value === "string") {
    if (value.length === 0) return;
    if (value.length > 5000) throw new Error(`${path} is too long`);
    if (path.startsWith("content.home.noticeBoard.items[") && path.endsWith(".publishAt") && !Number.isFinite(Date.parse(value))) {
      throw new Error(`${path} must be a valid publish date and time`);
    }
    if (/(?:image|photo|logo|src|url|href|link)$/i.test(path.split(".").at(-1))) {
      validateImageAddressForWebUrl(value, path);
    }
    return;
  }
  if (value === null || typeof value === "boolean") return;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error(`${path} must be a finite number`);
    return;
  }
  if (Array.isArray(value)) {
    if (value.length > 100) throw new Error(`${path} has too many items`);
    value.forEach((item, index) => validateTree(item, `${path}[${index}]`, depth + 1));
    return;
  }
  if (!isPlainObject(value)) throw new Error(`${path} contains an unsupported value`);
  for (const [key, nestedValue] of Object.entries(value)) {
    if (key.length > 80 || ["__proto__", "prototype", "constructor"].includes(key)) {
      throw new Error(`${path} contains an invalid field`);
    }
    validateTree(nestedValue, `${path}.${key}`, depth + 1);
  }
}

export function validateSiteContentPatch(patch) {
  if (!isPlainObject(patch) || Object.keys(patch).length === 0) {
    throw new Error("Provide site details, page content, or section visibility to save");
  }

  const allowedRoots = new Set(["site", "content", "visibility"]);
  for (const key of Object.keys(patch)) {
    if (!allowedRoots.has(key)) throw new Error(`Unknown content group: ${key}`);
  }

  if (patch.site !== undefined) {
    if (!isPlainObject(patch.site)) throw new Error("site must be an object");
    for (const [key, value] of Object.entries(patch.site)) {
      if (!SITE_FIELDS.has(key)) throw new Error(`Unknown site field: ${key}`);
      if (key === "socialLinks") {
        if (!isPlainObject(value)) throw new Error("socialLinks must be an object");
        for (const [social, link] of Object.entries(value)) {
          if (!SOCIAL_FIELDS.has(social) || typeof link !== "string" || link.length > 500) {
            throw new Error(`Invalid social link: ${social}`);
          }
          if (link) validateImageAddressForWebUrl(link, `site.socialLinks.${social}`);
        }
      } else {
        if (typeof value !== "string" || value.length > 500) throw new Error(`site.${key} must be text under 500 characters`);
        if (key === "logoUrl") validateImageAddress(value, `site.${key}`);
        if (key === "mapUrl" && value) validateImageAddressForWebUrl(value, `site.${key}`);
      }
    }
  }

  if (patch.content !== undefined) {
    if (!isPlainObject(patch.content)) throw new Error("content must be an object");
    for (const [page, sections] of Object.entries(patch.content)) {
      if (!Object.hasOwn(SITE_SECTIONS, page) || !isPlainObject(sections)) throw new Error(`Unknown content page: ${page}`);
      for (const [section, value] of Object.entries(sections)) {
        if (!SITE_SECTIONS[page].includes(section)) throw new Error(`Unknown ${page} section: ${section}`);
        validateTree(value, `content.${page}.${section}`);
      }
    }
  }

  if (patch.visibility !== undefined) {
    if (!isPlainObject(patch.visibility)) throw new Error("visibility must be an object");
    for (const [page, sections] of Object.entries(patch.visibility)) {
      if (!Object.hasOwn(SITE_SECTIONS, page) || !isPlainObject(sections)) throw new Error(`Unknown visibility page: ${page}`);
      for (const [section, visible] of Object.entries(sections)) {
        if (!SITE_SECTIONS[page].includes(section) || typeof visible !== "boolean") {
          throw new Error(`Invalid visibility setting for ${page}.${section}`);
        }
      }
    }
  }

  if (Buffer.byteLength(JSON.stringify(patch), "utf8") > 500_000) {
    throw new Error("The content update is too large");
  }
}

function validateImageAddressForWebUrl(value, path) {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return;
  } catch {
    // Use one consistent validation message below.
  }
  throw new Error(`${path} must be an HTTP(S) URL`);
}

export function mergeContent(current, patch) {
  if (!isPlainObject(current) || !isPlainObject(patch)) return structuredClone(patch);
  const merged = { ...current };
  for (const [key, value] of Object.entries(patch)) {
    merged[key] = isPlainObject(value) && isPlainObject(merged[key])
      ? mergeContent(merged[key], value)
      : structuredClone(value);
  }
  return merged;
}
