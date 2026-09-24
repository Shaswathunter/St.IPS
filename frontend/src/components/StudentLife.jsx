import { motion } from "framer-motion";
import {
  BookOpen,
  Trophy,
  Music4,
  Code,
  Camera,
  Trees,
} from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

const activities = [
  {
    title: "Interactive Learning",
    icon: <BookOpen size={32} />,
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7",
  },
  {
    title: "Sports Academy",
    icon: <Trophy size={32} />,
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b",
  },
  {
    title: "Music & Dance",
    icon: <Music4 size={32} />,
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
  },
  {
    title: "Coding & Robotics",
    icon: <Code size={32} />,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },
  {
    title: "Creative Arts",
    icon: <Camera size={32} />,
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
  },
  {
    title: "Green Campus",
    icon: <Trees size={32} />,
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
  },
];

export default function StudentLife() {
  const { content } = useSiteContent();
  const section = content.home.studentLife;
  return (
    <section className="py-24 bg-white" aria-label={section.eyebrow}>

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="uppercase tracking-[4px] text-yellow-500 font-semibold">
            {section.eyebrow}
          </span>

          <h2 className="text-5xl font-black text-[#0A2A66] mt-4">
            {section.title}
          </h2>

          <p className="mt-6 text-gray-600 max-w-3xl mx-auto leading-8">
            {section.description}
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {section.items.map((item, index) => (

            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="group overflow-hidden rounded-3xl shadow-xl"
            >

              <div className="relative">

                <img
                  src={item.image || undefined}
                  alt={item.imageAlt || item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-72 object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2A66]/90 via-transparent"></div>

                <div className="absolute top-5 left-5 w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                  {activities[index % activities.length]?.icon}
                </div>

                <div className="absolute bottom-6 left-6">

                  <h3 className="text-white text-2xl font-bold">
                    {item.title}
                  </h3>

                </div>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}
