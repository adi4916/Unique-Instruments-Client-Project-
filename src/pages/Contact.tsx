import React from 'react';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Our Location</h2>
          <p className="text-gray-700">
            123 Music Street<br />
            Harmony City, HC 12345<br />
            India
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Contact Information</h2>
          <p className="text-gray-700">
            Email: info@uniqueinstruments.com<br />
            Phone: +91 123-456-7890<br />
            Hours: Monday-Friday, 9am-5pm
          </p>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Send Us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={4}
                placeholder="Your Message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;