import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import Contact from '../components/Contact';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="py-20 px-4 max-w-6xl mx-auto text-center flex-grow">
        <h1 className="text-4xl font-bold mb-6 text-blue-900">About JVBReal Estate</h1>
        <p className="mb-8 text-lg text-gray-700">
          Welcome to JVBReal Estate, where your dream home becomes a reality. As a premier real estate agency, we specialize in assisting clients with buying, selling, and renting properties in the most sought-after neighborhoods.
        </p>
        <p className="mb-8 text-lg text-gray-700">
          At JVBReal Estate, our mission is to transform your real estate aspirations into tangible success. Our dedicated team of experienced agents is committed to delivering exceptional service, expert advice, and an in-depth understanding of the local market.
        </p>
        <p className="mb-8 text-lg text-gray-700">
          Whether you are embarking on the journey to find your perfect home, looking to sell a property, or exploring rental options, we are here to guide you every step of the way. Your goals are our priority, and we strive to make your real estate experience exciting and rewarding.
        </p>
      </div>

      {/* Footer with interactive icons and "All rights reserved" */}
      <footer className="bg-blue-900 text-white py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faEnvelope} className="text-lg mr-2" />
            <p className="text-sm">jvbrealestate@gmail.com</p>
          </div>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faPhoneAlt} className="text-lg mr-2" />
            <p className="text-sm">+63 945 331 0511</p>
          </div>
          <p className="text-sm">&copy; 2024 JVBReal Estate. All rights reserved.</p>
          {/* <Link to="/contact" className="text-sm hover:underline">
            Contact Us
          </Link> */}
        </div>
      </footer>
    </div>
  );
}
