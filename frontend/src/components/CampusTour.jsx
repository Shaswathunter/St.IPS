import { motion } from "framer-motion";
import { PlayCircle, ArrowRight } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

const CampusTour = () => {
  const { content } = useSiteContent();
  const tour = content.home.campusTour;
  return (
    <section className="relative py-32 overflow-hidden" aria-label={tour.eyebrow}>

      {/* Background */}

      <img
        src={tour.backgroundImage || undefined}
        alt={tour.backgroundAlt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-[#0A2A66]/80"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white">

        <span className="uppercase tracking-[4px] text-yellow-400 font-semibold">
          {tour.eyebrow}
        </span>

        <h2 className="text-5xl lg:text-6xl font-black mt-6 leading-tight">
          {tour.title}
        </h2>

        <p className="max-w-3xl mx-auto mt-8 text-blue-100 text-lg leading-8">
          {tour.description}
        </p>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: .95 }}
          aria-label={tour.playButtonLabel}
          className="mt-12 w-24 h-24 rounded-full bg-yellow-500 flex items-center justify-center mx-auto shadow-2xl"
        >
          <PlayCircle size={55} className="text-white" />
        </motion.button>

        <div className="mt-14">

          <button className="bg-white text-[#0A2A66] px-8 py-4 rounded-xl font-semibold inline-flex items-center gap-2 hover:bg-gray-100 transition">

            {tour.buttonText}

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

    </section>
  );
};

export default CampusTour;
