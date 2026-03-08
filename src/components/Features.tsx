import React from "react";
import { Shield, Award, PenTool as Tool, Truck } from "lucide-react";
import { motion } from "framer-motion";
const Features = () => {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Quality Assured",
      description:
        "All our instruments are tested and certified for professional use",
    },
    {
      icon: <Award className="h-8 w-8 text-red-600" />,
      title: "Expert Support",
      description:
        "Technical support and consultation available for all products",
    },
    {
      icon: <Tool className="h-8 w-8 text-red-600" />,
      title: "Wide Selection",
      description:
        "Comprehensive range of construction and laboratory equipment",
    },
    {
      icon: <Truck className="h-8 w-8 text-red-600" />,
      title: "Fast Delivery",
      description: "Quick and secure shipping to your location",
    },
  ];

  return (
    <div className="py-24 bg-blue-900 to-blue-1600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Title */}
          <h2 className="text-3xl font-extrabold text-white">
            {"Why Choose Unique Instruments?".split(" ").map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.25, duration: 0.6 }}
                className="mr-2 inline-block"
                viewport={{ once: true }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-4 text-lg text-gray-300"
          >
            We provide reliable, high-quality engineering instruments backed by expert service and trusted by professionals and institutions across India.
          </motion.p>
        </div>
      </div>

      <div className="mt-20 ">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 ">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 text-center ">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
