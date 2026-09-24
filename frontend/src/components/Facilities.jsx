import { motion } from "framer-motion";
import {
  Microscope,
  Monitor,
  Bus,
  BookOpen,
  Dumbbell,
  Music,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

const facilities = [
  {
    title: "Science Laboratories",
    icon: <Microscope size={34} />,
    image: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e",
  },
  {
    title: "Computer Lab",
    icon: <Monitor size={34} />,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },
  {
    title: "Digital Library",
    icon: <BookOpen size={34} />,
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da",
  },
  {
    title: "Sports Complex",
    icon: <Dumbbell size={34} />,
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b",
  },
  {
    title: "Music & Arts",
    icon: <Music size={34} />,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
  },
  {
    title: "GPS Transport",
    icon: <Bus size={34} />,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
  },
  {
    title: "Campus Security",
    icon: <ShieldCheck size={34} />,
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
  },
  {
    title: "Medical Centre",
    icon: <HeartPulse size={34} />,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
  },
];

const Facilities = () => {
  const { content } = useSiteContent();
  const section = content.home.facilities;
  return (
    <section id="facilities" className="py-24 bg-[#f8fafc]" aria-label={section.eyebrow}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="uppercase tracking-[4px] text-yellow-500 font-semibold">
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
          {section.items.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="group rounded-3xl overflow-hidden bg-white shadow-xl"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image || undefined}
                  alt={item.imageAlt || item.title}
                  loading="lazy"
                  decoding="async"
                  className="h-60 w-full object-cover group-hover:scale-110 transition duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                <div className="absolute top-5 left-5 w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  {facilities[index % facilities.length]?.icon}
                </div>

                <div className="absolute bottom-5 left-5">
                  <h3 className="text-white font-bold text-2xl">
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
};

export default Facilities;
