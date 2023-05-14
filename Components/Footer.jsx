import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <p className="text-gray-300">
          © 2023 Your Company. All rights reserved.
        </p>
        <div>
          <a href="#" className="text-gray-300 hover:text-white mx-2">
            Terms of Service
          </a>
          <span className="text-gray-300">|</span>
          <a href="#" className="text-gray-300 hover:text-white mx-2">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
