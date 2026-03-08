import { Phone, Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="bg-red-500 py-5">
      <div className="max-w-7xl mx-auto px-6">

        {/* Title */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-white">
            Get In Touch
          </h2>
          <p className="text-red-100 mt-3 text-lg">
            Contact Unique Instruments for product inquiries and support
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* Phone */}
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center hover:shadow-2xl hover:-translate-y-2 transition duration-300">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-red-100 mb-5">
              <Phone className="text-red-600" size={26} />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Call Us
            </h3>

            <p className="text-gray-600">09867094431</p>
            <p className="text-gray-600">09867094430</p>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition duration-300">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-red-100 mb-5">
              <Mail className="text-red-600" size={26} />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Email Us
            </h3>

            <p className="text-gray-600 break-words">
              uniqueinstrument_ml@yahoo.co.in
            </p>

            <p className="text-gray-600 break-words">
              pradeep@uniqueinsinfo.com
            </p>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition duration-300">
            <div className="w-14 h-14 mx-auto flex items-center justify-center rounded-full bg-red-100 mb-5">
              <MapPin className="text-red-600" size={26} />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Our Offices
            </h3>

            <p className="font-medium text-gray-700 mt-2">
              Mumbai Office
            </p>

            <p className="text-gray-600 text-sm">
              34, Hazi Ismail Gani Bldg <br/>
              Opp. Byculla Railway Station (E) <br/>
              Mumbai – 400027
            </p>

            <p className="font-medium text-gray-700 mt-4">
              Goa Office
            </p>

            <p className="text-gray-600 text-sm">
              T-1, Third Floor <br/>
              Gokul Smriti Building <br/>
              Dhavli, Ponda – Goa 403401
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;