import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ArrowLeft, ArrowRight, Play, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteContent } from "../context/SiteContentContext";

const Hero = () => {
  const heroRef = useRef();
  const { content } = useSiteContent();
  const hero = content.home.hero;
  const [slideIndex, setSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const slides = useMemo(() => {
    const uploaded = Array.isArray(hero.slides)
      ? hero.slides.filter((slide) => typeof slide?.image === "string" && slide.image.trim()).slice(0, 5)
      : [];
    return uploaded.length ? uploaded : hero.backgroundImage ? [{ image: hero.backgroundImage, alt: hero.backgroundAlt }] : [];
  }, [hero.slides, hero.backgroundImage, hero.backgroundAlt]);
  const activeSlide = slides[slideIndex % Math.max(slides.length, 1)];

  useEffect(() => {
    setSlideIndex((current) => current % Math.max(slides.length, 1));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || paused || reducedMotion) return undefined;
    const timer = window.setInterval(() => setSlideIndex((current) => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [slides.length, paused, reducedMotion]);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline();
      timeline.from(".badge", { y: -20, opacity: 0, duration: 0.5 })
        .from(".hero-title", { y: 60, opacity: 0, duration: 1, ease: "power4.out" })
        .from(".hero-text", { y: 30, opacity: 0, duration: 0.7 }, "-=0.6")
        .from(".hero-btn", { opacity: 0, y: 20, stagger: 0.2 }, "-=0.3")
        .from(".hero-stat", { opacity: 0, y: 30, stagger: 0.15 }, "-=0.4");
      return () => timeline.kill();
    });
    return () => media.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      aria-label={hero.eyebrow}
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
      className="relative h-screen overflow-hidden"
    >
      {/* Background */}
      <AnimatePresence mode="wait">
        {activeSlide && <motion.img
          key={activeSlide.image}
          src={activeSlide.image}
          alt={activeSlide.alt || hero.backgroundAlt || "ST.IPS school life"}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          initial={reducedMotion ? false : { opacity: 0, scale: 1.025 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: reducedMotion ? 0 : 0.7 }, scale: { duration: 6.5, ease: "linear" } }}
          className="absolute inset-0 h-full w-full object-cover"
        />}
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}

      <div className="relative z-20 max-w-7xl mx-auto px-6 h-full flex items-center">

        <div className="max-w-3xl text-white">

          <div className="badge inline-block px-5 py-2 rounded-full bg-yellow-500 text-black font-semibold mb-6">
            ✦ {hero.eyebrow}
          </div>

          <h1 className="hero-title text-5xl md:text-7xl font-black leading-tight">
            {hero.title}
          </h1>

          <p className="hero-text mt-8 text-lg md:text-xl text-gray-200 leading-8">
            {hero.body}
          </p>

          <div className="flex flex-wrap gap-5 mt-10">

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: .95 }}
              className="hero-btn"
            >
              <Link to="/admissions" className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-semibold flex items-center gap-2 hover:bg-yellow-400 transition">{hero.admissionsButton} <ArrowRight size={18}/></Link>
            </motion.div>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: .95 }}
              href="/#gallery"
              className="hero-btn border border-white/60 bg-white/10 backdrop-blur px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-white/20 transition"
            >
              <Play size={18}/>
              {hero.exploreButton}
            </motion.a>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16">

            {hero.stats.map(({ value, label }, index) => (

              <div
                key={`${label}-${index}`}
                className="hero-stat bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5"
              >
                <h2 className="text-3xl font-bold text-yellow-400">
                  {value}
                </h2>

                <p className="text-sm text-gray-200 mt-2">
                  {label}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* Scroll */}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
        <ChevronDown size={35}/>
      </div>

      {slides.length > 1 && <div className="hero-carousel-controls absolute bottom-7 right-6 z-30 flex items-center gap-2 rounded-full border border-white/25 bg-slate-950/40 px-3 py-2 text-white backdrop-blur-md sm:right-10" aria-label="Hero image controls">
        <button type="button" onClick={() => setSlideIndex((current) => (current - 1 + slides.length) % slides.length)} className="hero-carousel-arrow" aria-label="Previous photo"><ArrowLeft size={17} aria-hidden="true"/></button>
        <div className="flex items-center gap-1.5" role="group" aria-label="Choose a hero photo">
          {slides.map((slide, index) => <button key={`${slide.image}-${index}`} type="button" onClick={() => setSlideIndex(index)} className={`hero-carousel-dot ${index === slideIndex ? "is-active" : ""}`} aria-label={`Show photo ${index + 1} of ${slides.length}`} aria-pressed={index === slideIndex}/>) }
        </div>
        <button type="button" onClick={() => setSlideIndex((current) => (current + 1) % slides.length)} className="hero-carousel-arrow" aria-label="Next photo"><ArrowRight size={17} aria-hidden="true"/></button>
        <span className="sr-only" aria-live="polite">Photo {slideIndex + 1} of {slides.length}</span>
      </div>}

    </section>
  );
};

export default Hero;
