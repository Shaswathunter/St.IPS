import { motion } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";
import { useSiteContent } from "../context/SiteContentContext";

export default function NewsEvents() {
  const { content } = useSiteContent();
  const section = content.home.newsEvents;
  return (
    <section id="events" className="py-24 bg-gray-50" aria-label={section.eyebrow}>

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="uppercase tracking-[4px] text-yellow-500 font-semibold">
            {section.eyebrow}
          </span>

          <h2 className="text-5xl font-black text-[#0A2A66] mt-4">
            {section.title}
          </h2>

          <p className="text-gray-600 mt-5 max-w-2xl mx-auto">
            {section.description}
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* News */}

          <div>

            <h3 className="text-3xl font-bold text-[#0A2A66] mb-8">
              {section.newsLabel || "Latest News"}
            </h3>

            {section.news.map((item, index) => (

              <motion.div
                key={index}
                whileHover={{ x: 10 }}
                className="bg-white rounded-2xl shadow-lg p-6 mb-5 border-l-4 border-yellow-500"
              >

                <p className="text-sm text-gray-500">
                  {item.date}
                </p>

                <h4 className="font-bold text-xl mt-2">
                  {item.title}
                </h4>

                <button className="flex items-center gap-2 text-[#0A2A66] font-semibold mt-4">

                  {section.readMoreLabel || "Read More"}

                  <ArrowRight size={16} />

                </button>

              </motion.div>

            ))}

          </div>

          {/* Events */}

          <div>

            <h3 className="text-3xl font-bold text-[#0A2A66] mb-8">
              {section.eventsLabel || "Upcoming Events"}
            </h3>

            {section.events.map((item, index) => (

              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="flex bg-white rounded-2xl shadow-lg overflow-hidden mb-5"
              >

                <div className="bg-[#0A2A66] text-white flex flex-col justify-center items-center w-28">

                  <h2 className="text-4xl font-black">
                    {item.day}
                  </h2>

                  <p>
                    {item.month}
                  </p>

                </div>

                <div className="p-6 flex-1">

                  <div className="flex items-center gap-2 text-gray-500">

                    <CalendarDays size={18} />

                    {item.time}

                  </div>

                  <h4 className="font-bold text-xl mt-3">

                    {item.title}

                  </h4>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}
