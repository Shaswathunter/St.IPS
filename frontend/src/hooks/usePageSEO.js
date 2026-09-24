import { useEffect } from "react";

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content || "");
}

export default function usePageSEO({ title, description, image, site }) {
  useEffect(() => {
    const pageUrl = new URL(window.location.pathname, window.location.origin).href;
    const pageTitle = title || site.name;
    const summary = description || site.tagline;
    document.title = pageTitle;
    setMeta("name", "description", summary);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", site.name);
    setMeta("property", "og:title", pageTitle);
    setMeta("property", "og:description", summary);
    setMeta("property", "og:url", pageUrl);
    setMeta("property", "og:locale", "en_IN");
    setMeta("property", "og:image", image || site.logoUrl || "");
    setMeta("name", "twitter:card", image || site.logoUrl ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", pageTitle);
    setMeta("name", "twitter:description", summary);
    setMeta("name", "twitter:image", image || site.logoUrl || "");

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;

    let structuredData = document.getElementById("school-structured-data");
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.id = "school-structured-data";
      structuredData.type = "application/ld+json";
      document.head.appendChild(structuredData);
    }
    const schema = {
      "@context": "https://schema.org",
      "@type": "School",
      name: site.name,
      description: summary,
      url: new URL("/", window.location.origin).href,
      telephone: site.phone,
      image: image || site.logoUrl || undefined,
      logo: site.logoUrl || undefined,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address,
        addressLocality: "Agra",
        addressRegion: "Uttar Pradesh",
        addressCountry: "IN",
      },
    };
    structuredData.textContent = JSON.stringify(schema);
  }, [title, description, image, site]);
}
