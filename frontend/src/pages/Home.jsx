import Hero from "../components/Hero";
import Teachers from "../components/Teachers";
import NoticeBoard from "../components/NoticeBoard";
import Features from "../components/Features";
import Academics from "../components/Academics";
import Testimonials from "../components/Testimonials";
import AboutSchool from "../components/AboutSchool";
import Facilities from "../components/Facilities";
import Achievements from "../components/Achievements";
import NewsEvents from "../components/NewsEvents";
import Principal from "../components/Principal";
import StudentLife from "../components/StudentLife";
import CampusTour from "../components/CampusTour";
import Gallery from "../components/Gallery";
import { useSiteContent } from "../context/SiteContentContext";
import usePageSEO from "../hooks/usePageSEO";
const Home = () => {
  const { visibility, content, site } = useSiteContent();
  usePageSEO({ title: `${site.name} | School in Agra`, description: content.home.hero.body, image: content.home.hero.backgroundImage, site });
  const shown = (section) => visibility.home?.[section] !== false;
  return (
    <>
      {!shown("hero") && <h1 className="sr-only">{site.name} — {site.tagline}</h1>}
      {shown("hero") && <Hero />}

      {shown("teachers") && <Teachers />}

      {shown("noticeBoard") && <NoticeBoard />}

      {shown("principal") && <Principal/>}

      {shown("aboutSchool") && <AboutSchool />}

      {shown("features") && <Features />}

     {shown("academics") && <Academics />}

     {shown("facilities") && <Facilities />}

     {shown("studentLife") && <StudentLife />}

      {shown("campusTour") && <CampusTour />}

      {shown("gallery") && <Gallery />}

      {shown("achievements") && <Achievements />}

      {shown("newsEvents") && <NewsEvents />}

      {shown("testimonials") && <Testimonials />}
    </>
  );
};

export default Home;
