import { motion } from "framer-motion";
import { useSiteContent } from "../context/SiteContentContext";

const Testimonials = () => {
  const { content } = useSiteContent();
  const section = content.home.testimonials;
  return (
      <section className="py-16 bg-gray-100" aria-label={section.title}>
      <div className="max-w-7xl mx-auto px-6 text-center">

        {section.eyebrow && <span className="text-yellow-500 uppercase tracking-[3px] font-semibold">{section.eyebrow}</span>}
        <h2 className="text-3xl md:text-4xl font-bold text-primary">
          {section.title}
        </h2>

        <p className="mt-4 text-gray-600">
          {section.description}
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {section.items.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <p className="text-gray-600 italic">"{item.text}"</p>

              <h3 className="mt-4 font-semibold text-primary">
                - {item.name}
              </h3>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
