import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">About Us</h1>
        <p className="text-gray-700 mb-4">
          Unique Instruments is a premier provider of high-quality musical instruments. 
          Founded in 2023, we strive to bring the finest instruments to musicians of all levels.
        </p>
        <p className="text-gray-700 mb-4">
          Our inventory management system helps us keep track of our exclusive collection and 
          provide the best service to our customers.
        </p>
        <p className="text-gray-700">
          We take pride in our selection and our commitment to musical excellence.
        </p>
      </div>
    </div>
  );
};

export default About;