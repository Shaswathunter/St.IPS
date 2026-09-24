import { motion } from "framer-motion";

const courses = [
  {
    title: "Primary Education",
    desc: "Strong foundation with interactive learning methods.",
  },
  {
    title: "Secondary Education",
    desc: "Advanced subjects with conceptual clarity.",
  },
  {
    title: "Higher Secondary",
    desc: "Science, Commerce & Arts streams available.",
  },
];

const Courses = () => {
  return (
    <section className="py-16">
  <div className="max-w-7xl mx-auto px-6 text-center">

    <h2 className="text-3xl font-bold text-primary">
      Our Courses
    </h2>

    <div className="grid md:grid-cols-3 gap-8 mt-10">
      {courses.map((course, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          className="bg-white p-6 rounded-xl shadow-md border"
        >
          <h3 className="text-xl font-semibold text-primary">
            {course.title}
          </h3>

          <p className="mt-2 text-gray-600">
            {course.desc}
          </p>

          <button className="mt-4 text-secondary font-semibold">
            Learn More →
          </button>
        </motion.div>
      ))}
    </div>

  </div>
</section>
  );
};

export default Courses;