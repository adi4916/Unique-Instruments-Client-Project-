import labImg from "../img/Geotechnical-Engineering-Lab-mmantc-civil-engineering.jpg"; // lab instruments image
import plantImg from "../img/GT-1200-Topcon_480x480.webp"; // construction plant image
import { motion } from "framer-motion";

const Welcome = () => {
  return (
    <section id="about" className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* LEFT SIDE */}
          <div>
            {/* Title */}
            <br />
            <motion.h1
                initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
                className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
              <span className="text-blue-800 block">Welcome To</span>

              <span className="text-blue-800 block">Unique Instruments</span>
            </motion.h1>
            <br />
            <br />
            {/* Lab Image */}
            <motion.img
              src={labImg}
              alt="Laboratory Equipment"
              className="rounded-xl shadow-md w-full "
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 3 }}
              viewport={{ once: true }}
            />
          </div>

          {/* RIGHT SIDE */}
          <div>
            {/* Construction Image */}
            <motion.img
              src={plantImg}
              alt="Construction Plant"
              className="rounded-xl shadow-md mb-6 w-full"
                initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 3 }}
              viewport={{ once: true }}
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 2 }}
              viewport={{ once: true }}
              className="text-gray-600 text-2xl font-medium leading-relaxed"
            >
              Unique Instruments, established in 2008, specializes in
              construction surveying instruments and scientific equipment. We
              supply high-quality instruments to engineering colleges,
              construction companies, government organizations, and cement
              industries across India.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
