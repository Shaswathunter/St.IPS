import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MapPin, ShieldCheck } from "lucide-react";
import ThemeToggle from "./common/ThemeToggle";
import { useSiteContent } from "../context/SiteContentContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Admissions", path: "/admissions" },
  { name: "Academics", path: "/#academics" },
  { name: "Facilities", path: "/#facilities" },
  { name: "Gallery", path: "/#gallery" },
  { name: "Events", path: "/#events" },
  { name: "Notices", path: "/#notices" },
  { name: "Contact", path: "/#contact" },
];

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const menuButtonRef = useRef(null);
  const location = useLocation();
  const { site, content, visibility } = useSiteContent();
  if (visibility.shared?.header === false) return null;
  const shown = (section) => visibility.home?.[section] !== false;
  const pageShown = (page) => Object.values(visibility[page] || {}).some(Boolean);
  const visibleNavLinks = navLinks.filter((item) => {
    if (item.name === "About") return pageShown("about");
    if (item.name === "Admissions") return pageShown("admissions");
    if (item.name === "Academics") return shown("academics");
    if (item.name === "Facilities") return shown("facilities");
    if (item.name === "Gallery") return shown("gallery");
    if (item.name === "Events") return shown("newsEvents");
    if (item.name === "Notices") return shown("noticeBoard");
    if (item.name === "Contact") return visibility.shared?.footer !== false;
    return true;
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 60);
      if (mobileOpen) setHidden(false);
      else if (currentY > 140 && currentY - lastScrollY.current > 8) setHidden(true);
      else if (lastScrollY.current - currentY > 8 || currentY < 80) setHidden(false);
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  useEffect(() => setMobileOpen(false), [location.pathname, location.hash]);

  const isActive = (path) => {
    const [pathname, hash] = path.split("#");
    if (location.pathname !== pathname) return false;
    return hash ? location.hash === `#${hash}` : !location.hash;
  };

  const linkClass = (path, mobile = false) => {
    const active = isActive(path);
    return `site-nav-link relative font-medium transition-colors ${mobile ? "block py-2 text-sm" : "whitespace-nowrap text-[13px]"} ${active ? "text-yellow-500" : scrolled ? "text-gray-800 hover:text-[#0A2A66]" : "text-white hover:text-yellow-300"}`;
  };

  return (
    <>
      <div className="hidden lg:block bg-[#0A2A66] text-white">
        <div className="mx-auto flex max-w-7xl justify-between px-6 py-2 text-sm">
          <div className="flex gap-6">
            <a href={`tel:${site.phone}`} className="flex items-center gap-2 hover:text-amber-300"><Phone size={15} aria-hidden="true"/>{site.phone}</a>
            <span className="flex items-center gap-2"><MapPin size={15} aria-hidden="true"/>{site.address}</span>
          </div>
          <span>{content.shared?.header?.notice}</span>
        </div>
      </div>

      <header
        onFocusCapture={() => setHidden(false)}
        onKeyDown={(event) => { if (event.key === "Escape" && mobileOpen) { setMobileOpen(false); menuButtonRef.current?.focus(); } }}
        aria-hidden={hidden && !mobileOpen}
        inert={hidden && !mobileOpen}
        data-scrolled={scrolled}
        className={`site-navbar fixed left-0 z-50 w-full transition-all duration-300 ${hidden && !mobileOpen ? "-translate-y-full pointer-events-none" : "translate-y-0"} ${scrolled ? "top-0 bg-white shadow-lg py-3" : "top-0 bg-transparent py-4 lg:top-9 lg:py-5"}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 lg:px-6">
          <Link to="/" className="flex shrink-0 flex-col" aria-label={`${site.name} home`}>
            {site.logoUrl ? <img src={site.logoUrl} alt={site.name} className="max-h-10 max-w-36 object-contain"/> : <span className={`site-brand-name text-2xl font-black leading-none ${scrolled ? "text-[#0A2A66]" : "text-white"}`}>{site.name}</span>}
            <span className={`site-brand-address mt-1 text-[10px] ${scrolled ? "text-gray-500" : "text-gray-200"}`}>{content.shared?.header?.addressLabel}</span>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-4 xl:flex">
            {visibleNavLinks.map((item) => (
              <Link key={item.name} to={item.path} aria-current={isActive(item.path) ? "page" : undefined} className={linkClass(item.path)}>
                {item.name}
                {isActive(item.path) && <motion.span layoutId="nav-indicator" className="nav-indicator" />}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 xl:flex">
            <ThemeToggle className={scrolled ? "theme-toggle-scrolled" : "theme-toggle-hero"} />
            <Link to="/admin" className={`admin-login-nav ${scrolled ? "admin-login-nav-scrolled" : "admin-login-nav-hero"}`}>
              <ShieldCheck size={16} aria-hidden="true" />
              Admin Login
            </Link>
            {pageShown("admissions") && <Link to="/admissions" className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400 focus-visible:outline-offset-2">Apply Now</Link>}
          </div>

          <div className="flex items-center gap-2 xl:hidden">
            <ThemeToggle className={scrolled ? "theme-toggle-scrolled" : "theme-toggle-hero"} />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              className={`grid h-10 w-10 place-items-center rounded-xl ${scrolled || mobileOpen ? "text-slate-900 dark:text-slate-100" : "text-white"}`}
            >
              {mobileOpen ? <X size={24} aria-hidden="true"/> : <Menu size={24} aria-hidden="true"/>}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {mobileOpen && (
            <motion.nav
              id="mobile-navigation"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="mobile-navigation overflow-hidden border-t border-slate-100 bg-white shadow-xl xl:hidden"
            >
              <div className="mx-auto flex max-h-[75vh] max-w-7xl flex-col gap-1 overflow-y-auto px-6 py-4">
                {visibleNavLinks.map((item) => (
                  <Link key={item.name} to={item.path} aria-current={isActive(item.path) ? "page" : undefined} className={`${linkClass(item.path, true)} mobile-nav-link`}>
                    {item.name}
                  </Link>
                ))}
                <Link to="/admin" className="mobile-admin-login">
                  <ShieldCheck size={17} aria-hidden="true" />
                  Admin Login
                </Link>
                {pageShown("admissions") && <Link to="/admissions" className="mt-3 rounded-xl bg-[#0A2A66] py-3 text-center text-sm font-semibold text-white">Apply Now</Link>}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export default Navbar;
