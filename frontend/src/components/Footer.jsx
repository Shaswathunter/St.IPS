import { Link } from "react-router-dom";
import { useSiteContent } from "../context/SiteContentContext";

const Footer = () => {
  const { site, content, visibility } = useSiteContent();
  if (visibility.shared?.footer === false) return null;
  const footer = content.shared.footer;
  return (
    <footer id="contact" className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* School Info */}
        <div>
          <h2 className="text-2xl font-bold" title={site.tagline}>{site.name}</h2>
          <p className="mt-3 text-gray-200">
            {footer.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">{["facebook", "instagram", "youtube", "linkedin"].filter((name) => site.socialLinks?.[name]).map((name) => <a key={name} href={site.socialLinks[name]} target="_blank" rel="noreferrer" aria-label={`${name} page`} className="rounded-full bg-white/10 px-3 py-2 text-sm capitalize hover:bg-white/20">{name}</a>)}</div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">{footer.quickLinksTitle}</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-secondary">Home</Link></li>
            <li><Link to="/about" className="hover:text-secondary">About</Link></li>
            <li><Link to="/admissions" className="hover:text-secondary">Admissions</Link></li>
            <li><Link to="/#contact" className="hover:text-secondary">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-3">{footer.contactTitle}</h3>
          <p className="text-gray-200">📍 {site.address}</p>
          <a href={`tel:${site.phone}`} className="block text-gray-200 mt-2 hover:text-secondary">📞 {site.phone}</a>
          {site.email && <a href={`mailto:${site.email}`} className="block text-gray-200 mt-2 hover:text-secondary">✉ {site.email}</a>}
          {site.mapUrl && <a href={site.mapUrl} target="_blank" rel="noreferrer" className="block text-gray-200 mt-2 hover:text-secondary">View on map</a>}
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-800 text-center py-4 text-sm">
        © {new Date().getFullYear()} {site.name}. {footer.copyright}
      </div>
    </footer>
  );
};

export default Footer;
