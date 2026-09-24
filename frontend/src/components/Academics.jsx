import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

const Academics = () => {
  const { content } = useSiteContent();
  const section = content.home.academics;
  return (
    <section id="academics" className="py-24 bg-white" aria-label={section.eyebrow}>

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-yellow-500 uppercase tracking-[4px] font-semibold">
            {section.eyebrow}
          </span>

          <h2 className="text-5xl font-black text-[#0A2A66] mt-4">
            {section.title}
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-gray-600 leading-8">
            {section.description}
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {section.items.map((item, index) => (

            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="group overflow-hidden rounded-3xl shadow-xl bg-white"
            >

              <div className="relative overflow-hidden">

                <img
                  src={item.image || undefined}
                  alt={item.imageAlt || item.title}
                  loading="lazy"
                  decoding="async"
                  className="h-72 w-full object-cover group-hover:scale-110 transition duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                <div className="absolute bottom-6 left-6 text-white">

                  <p className="text-sm uppercase tracking-widest">
                    {item.age}
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    {item.title}
                  </h3>

                </div>

              </div>

              <div className="p-6">

                <p className="text-gray-600 leading-7">
                  {item.description}
                </p>

                <button className="mt-6 flex items-center gap-2 font-semibold text-[#0A2A66]">

                  {section.exploreLabel || "Explore Program"}

                  <ArrowRight size={18} />

                </button>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default Academics;
