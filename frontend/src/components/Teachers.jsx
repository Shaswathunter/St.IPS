import { motion } from "framer-motion";
import { useSiteContent } from "../context/SiteContentContext";

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default function Teachers() {
  const { content } = useSiteContent();
  const section = content.home.teachers;
  const teachers = section.items.filter((teacher) => typeof teacher.name === "string" && teacher.name.trim());

  if (!teachers.length) return null;

  return (
    <section id="teachers" className="bg-gray-50 py-20 md:py-24" aria-labelledby="teachers-heading">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-[0.22em] text-amber-600">{section.eyebrow}</p>
          <h2 id="teachers-heading" className="mt-3 text-4xl font-black text-[#0A2A66] md:text-5xl">{section.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">{section.description}</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher, index) => (
            <motion.article
              key={`${teacher.name}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.28) }}
              whileHover={{ y: -5 }}
              className="teacher-card overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-xl"
            >
              {teacher.image ? (
                <img src={teacher.image} alt={teacher.imageAlt || `${teacher.name}, ST.IPS teacher`} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
              ) : (
                <div className="grid aspect-[4/3] w-full place-items-center bg-gradient-to-br from-blue-100 via-sky-50 to-amber-50 text-5xl font-bold text-blue-900" aria-hidden="true">{initials(teacher.name)}</div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900">{teacher.name}</h3>
                {teacher.qualification && <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{teacher.qualification}</p>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
