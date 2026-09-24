import { motion } from "framer-motion";
import {
  GraduationCap,
  MonitorSmartphone,
  Microscope,
  Bus,
  BookOpen,
  ShieldCheck,
  Trophy,
  BrainCircuit,
} from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

const featureIcons = [GraduationCap, MonitorSmartphone, Microscope, BookOpen, Bus, Trophy, BrainCircuit, ShieldCheck];

const Features = () => {
  const { content } = useSiteContent();
  const section = content.home.features;
  return (
    <section className="py-24 bg-slate-50" aria-label={section.eyebrow}>
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-yellow-500 uppercase tracking-[4px] font-semibold">
            {section.eyebrow}
          </span>

          <h2 className="text-5xl font-black text-[#0A2A66] mt-4">
            {section.title}
          </h2>

          <p className="max-w-3xl mx-auto mt-6 text-gray-600 leading-8">
            {section.description}
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {section.items.map((item, index) => {
            const Icon = featureIcons[index % featureIcons.length];
            return (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: .5,
                delay: index * .08,
              }}
              whileHover={{
                y: -12,
              }}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 group"
            >

              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0A2A66] group-hover:bg-[#0A2A66] group-hover:text-white transition">

                <Icon size={42} />

              </div>

              <h3 className="text-xl font-bold mt-6 text-[#0A2A66]">
                {item.title}
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
                {item.description}
              </p>

            </motion.div>

          );})}

        </div>

      </div>
    </section>
  );
};

export default Features;
