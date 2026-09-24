import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteContent } from "../context/SiteContentContext";
import usePageSEO from "../hooks/usePageSEO";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef();
  const { content, visibility, site } = useSiteContent();
  const about = content.about;
  usePageSEO({ title: `${about.hero.title} | ${site.name}`, description: about.hero.description, image: about.mission.image, site });

  useEffect(() => {
    if (!sectionRef.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.fromTo(sectionRef.current.querySelectorAll(".animate"), { opacity: 0, y: 60 }, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });
      }, sectionRef);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <div ref={sectionRef} className="bg-gray-50">

      {visibility.about?.hero === false && <h1 className="sr-only">{about.hero.title}</h1>}
      {visibility.about?.hero !== false && <section aria-label={about.hero.title} className="h-[60vh] flex items-center justify-center bg-primary text-white text-center">
        <div className="animate">
          <h1 className="text-4xl md:text-5xl font-bold">
            {about.hero.title}
          </h1>
          <p className="mt-4 text-lg max-w-xl mx-auto">
            {about.hero.description}
          </p>
        </div>
      </section>}

      {/* ABOUT CONTENT */}
      {visibility.about?.mission !== false && <section aria-label={about.mission.title} className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        
        {/* Text */}
        <div className="animate">
          <h2 className="text-3xl font-bold text-primary">
            {about.mission.title}
          </h2>
          <p className="mt-4 text-gray-600">
            {about.mission.description}
          </p>
        </div>

        {/* Image */}
        <div className="animate">
          <img
            src={about.mission.image || undefined}
            alt={about.mission.imageAlt}
            loading="lazy"
            decoding="async"
            className="rounded-xl shadow-md"
          />
        </div>
      </section>}

      {/* VALUES */}
      {visibility.about?.values !== false && <section aria-label={about.values.title} className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <h2 className="text-3xl font-bold text-primary animate">
            {about.values.title}
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {about.values.items.map((value, index) => <div className="animate bg-gray-100 p-6 rounded-xl shadow" key={`${value.title}-${index}`}>
              <h3 className="text-xl font-semibold text-primary">{value.title}</h3>
              <p className="mt-2 text-gray-600">{value.description}</p>
            </div>)}
          </div>

        </div>
      </section>}

      {/* STATS */}
      {visibility.about?.community !== false && <section aria-label="School community" className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
          
          {about.community.items.map((item, index) => <div className="animate" key={`${item.value}-${index}`}>
            <h3 className="text-4xl font-bold">{item.value}</h3>
            <p className="mt-2">{item.label}</p>
          </div>)}

        </div>
      </section>}

    </div>
  );
};

export default About;
