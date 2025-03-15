import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon } from 'lucide-react';
export const Footer = () => {
  return <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="inline-block mb-6">
              <div className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                Rembeka Hub
              </div>
            </Link>
            <p className="text-gray-400 mb-6">
              The premier platform for beauty vendors to showcase their products
              and connect with customers worldwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <FacebookIcon size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <TwitterIcon size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <InstagramIcon size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <YoutubeIcon size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-pink-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/vendors" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Vendors
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">For Vendors</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/vendor-login" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Vendor Login
                </Link>
              </li>
              <li>
                <Link to="/vendor-dashboard" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/add-products" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Add Products
                </Link>
              </li>
              <li>
                <Link to="/vendor-support" className="text-gray-400 hover:text-pink-400 transition-colors">
                  Vendor Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <span className="block">123 Beauty Street</span>
                <span className="block">New York, NY 10001</span>
              </li>
              <li className="text-gray-400">
                <span className="block">Email: info@rembekahub.com</span>
                <span className="block">Phone: +1 (555) 123-4567</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link to="/contact" className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md transition-colors">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Rembeka Hub. All rights
              reserved.
            </p>
            <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-pink-400 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};