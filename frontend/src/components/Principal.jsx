import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

const Principal = () => {
  const { content, site } = useSiteContent();
  const principal = content.home.principal;
  return (
    <section className="py-24 bg-white" aria-label={principal.eyebrow}>

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Image */}

          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .8 }}
            className="relative"
          >

            <img
              src={principal.image || undefined}
              alt={principal.imageAlt}
              loading="lazy"
              decoding="async"
              className="rounded-3xl w-full h-[650px] object-cover shadow-2xl"
            />

            <div className="absolute -bottom-6 -right-6 bg-yellow-500 p-6 rounded-2xl shadow-xl">

              <Quote className="text-white" size={40} />

            </div>

          </motion.div>

          {/* Content */}

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: .8 }}
          >

            <span className="uppercase tracking-[4px] text-yellow-500 font-semibold">
              {principal.eyebrow}
            </span>

            <h2 className="text-5xl font-black text-[#0A2A66] mt-5 leading-tight">
              {principal.title}
            </h2>

            <p className="mt-8 text-gray-600 leading-8">
              {principal.message}
            </p>

            <h3 className="mt-10 text-2xl font-bold text-[#0A2A66]">
              {principal.name || site.principalName}
            </h3>

            <p className="text-gray-500">
              {principal.role}
            </p>

            <button className="mt-8 bg-[#0A2A66] hover:bg-blue-900 transition px-8 py-4 rounded-xl text-white font-semibold">
              {principal.buttonText}
            </button>

          </motion.div>

        </div>

      </div>

    </section>
  );
};

export default Principal;
