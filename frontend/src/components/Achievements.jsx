import { motion } from "framer-motion";
import {
  Trophy,
  GraduationCap,
  Users,
  Medal,
} from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

const Achievements = () => {
  const { content } = useSiteContent();
  const section = content.home.achievements;
  const icons = [<Users key="learn" size={38}/>, <GraduationCap key="create" size={38}/>, <Medal key="thrive" size={38}/>, <Trophy key="belong" size={38}/>];
  return (
    <section className="py-24 bg-[#0A2A66] text-white" aria-label={section.eyebrow}>

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="uppercase tracking-[4px] text-yellow-400 font-semibold">
            {section.eyebrow}
          </span>

          <h2 className="text-5xl font-black mt-4">
            {section.title}
          </h2>

          <p className="max-w-3xl mx-auto mt-6 text-blue-100 leading-8">
            {section.description}
          </p>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          {section.items.map((item, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * .15,
              }}
              whileHover={{
                scale: 1.05,
              }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center"
            >

              <div className="flex justify-center text-yellow-400">

                {icons[index % icons.length]}

              </div>

              <h3 className="text-5xl font-black mt-6">

                {item.value}

              </h3>

              <p className="mt-3 text-blue-100">

                {item.label}

              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default Achievements;
