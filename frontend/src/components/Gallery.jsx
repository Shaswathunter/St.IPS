import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

const galleryHeights = ["h-72", "h-96", "h-80"];

export default function Gallery() {
  const { content } = useSiteContent();
  const section = content.home.gallery;
  const photos = (Array.isArray(section.items) ? section.items : []).filter((item) => typeof item.image === "string" && item.image.trim());
  return (
    <section id="gallery" className="py-24 bg-white" aria-label={section.eyebrow}>

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="uppercase tracking-[4px] text-yellow-500 font-semibold">
            {section.eyebrow}
          </span>

          <h2 className="text-5xl font-black text-[#0A2A66] mt-4">
            {section.title}
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-gray-600 leading-8">
            {section.description}
          </p>

        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">

          {photos.map((item, index) => (

            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="mb-6 overflow-hidden rounded-3xl shadow-xl break-inside-avoid group cursor-pointer"
            >

              <div className={`relative ${galleryHeights[index % galleryHeights.length]}`}>

                <img
                  src={item.image || undefined}
                  alt={item.imageAlt || item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition">

                  <div className="absolute bottom-6 left-6">

                    <h3 className="text-white text-2xl font-bold">
                      {item.title}
                    </h3>

                  </div>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

        <div className="text-center mt-16">

          <button className="bg-[#0A2A66] hover:bg-blue-900 text-white px-8 py-4 rounded-xl inline-flex items-center gap-2 transition">

            {section.buttonText}

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

    </section>
  );
}
