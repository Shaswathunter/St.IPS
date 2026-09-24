import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function schoolSitemapPlugin(siteUrl) {
  return {
    name: "stips-sitemap",
    apply: "build",
    generateBundle(_options, bundle) {
      let origin = "";
      try {
        const url = new URL(siteUrl);
        if (url.protocol === "https:") origin = url.origin;
      } catch {
        // A public production origin is required for an absolute sitemap URL.
      }

      if (origin) {
        const urls = ["/", "/about", "/admissions"].map((path) => `  <url><loc>${origin}${path}</loc></url>`).join("\n");
        this.emitFile({ type: "asset", fileName: "sitemap.xml", source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n` });
      } else {
        this.warn("A production sitemap needs VITE_PUBLIC_SITE_URL set to the public HTTPS school website address.");
      }
      const robotsLines = ["User-agent: *", "Allow: /", "Disallow: /admin"];
      if (origin) robotsLines.push(`Sitemap: ${origin}/sitemap.xml`);
      this.emitFile({ type: "asset", fileName: "robots.txt", source: `${robotsLines.join("\n")}\n` });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: { extend: { colors: { primary: "#1E3A8A", secondary: "#F59E0B" } } },
    plugins: [react(), schoolSitemapPlugin(env.VITE_PUBLIC_SITE_URL)],
  };
});
