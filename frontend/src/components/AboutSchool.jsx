import { motion } from "framer-motion";
import { CheckCircle2, GraduationCap, School, Trophy } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

const AboutSchool = () => {
  const { content, site } = useSiteContent();
  const about = content.home.aboutSchool;
  const statIcons = [<GraduationCap key="care" size={32}/>, <School key="grow" size={32}/>, <Trophy key="lead" size={32}/>];
  return (
    <section className="py-24 bg-white" aria-label={about.eyebrow}>

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}

          <motion.div
            initial={{ x: -80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: .8 }}
            className="relative"
          >

            <img
              src={about.image || undefined}
              alt={about.imageAlt}
              loading="lazy"
              decoding="async"
              className="rounded-3xl shadow-2xl h-[600px] object-cover w-full"
            />

            <div className="absolute -bottom-8 -right-8 bg-[#0A2A66] text-white p-8 rounded-3xl shadow-xl">

              <h2 className="text-4xl font-bold">
                {site.name}
              </h2>

              <p className="mt-2">
                A place to learn and grow
              </p>

            </div>

          </motion.div>

          {/* Right */}

          <motion.div
            initial={{ x: 80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: .8 }}
          >

            <span className="text-yellow-500 uppercase tracking-[3px] font-semibold">
              {about.eyebrow}
            </span>

            <h2 className="text-5xl font-black text-[#0A2A66] mt-4 leading-tight">

              {about.title}

            </h2>

            <p className="text-gray-600 mt-8 leading-8">

              {about.description}

            </p>

            <div className="grid sm:grid-cols-2 gap-5 mt-10">

              {about.features.map((item, index) => (

                <div
                  key={`${item}-${index}`}
                  className="flex items-start gap-3"
                >

                  <CheckCircle2
                    className="text-green-600 mt-1"
                    size={22}
                  />

                  <span className="text-gray-700">
                    {item}
                  </span>

                </div>

              ))}

            </div>

            <button className="mt-10 bg-[#0A2A66] hover:bg-[#133d8f] transition text-white px-8 py-4 rounded-xl font-semibold">
              {about.learnMoreButton}
            </button>

          </motion.div>

        </div>

        {/* Bottom Cards */}

        <div className="grid md:grid-cols-3 gap-8 mt-24">

          {about.stats.map((item, index) => (

            <motion.div
              key={`${item.title}-${index}`}
              whileHover={{ y: -8 }}
              className="bg-gray-50 rounded-2xl shadow-lg p-8 text-center"
            >

              <div className="flex justify-center text-[#0A2A66]">
                {statIcons[index % statIcons.length]}
              </div>

              <h3 className="text-4xl font-black text-[#0A2A66] mt-4">
                {item.value}
              </h3>

              <p className="mt-2 text-gray-500">
                {item.title}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default AboutSchool;
