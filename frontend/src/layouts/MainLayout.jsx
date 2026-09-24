import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useSiteContent } from "../context/SiteContentContext";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const { visibility } = useSiteContent();

  useEffect(() => {
    let frameId;
    if (location.hash) {
      frameId = window.requestAnimationFrame(() => {
        document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        });
      });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    return () => {
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
    };
  }, [location.pathname, location.hash]);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navbar />
      <main id="main-content" tabIndex="-1" className={visibility.shared?.header === false ? "" : "pt-20"}>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
