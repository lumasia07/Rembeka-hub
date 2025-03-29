import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MenuIcon, XIcon, SearchIcon, ShoppingBagIcon, UserIcon } from 'lucide-react';
export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.5
          }} className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Rembeka Hub
            </motion.div>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-800 hover:text-pink-500 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-gray-800 hover:text-pink-500 transition-colors">
              Products
            </Link>
            <Link to="/services" className="text-gray-800 hover:text-pink-500 transition-colors">
              Services
            </Link>
            <Link to="/about" className="text-gray-800 hover:text-pink-500 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-800 hover:text-pink-500 transition-colors">
              Contact
            </Link>
          </nav>
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-pink-500 transition-colors">
              <SearchIcon size={20} />
            </button>
            <button className="text-gray-700 hover:text-pink-500 transition-colors">
              <ShoppingBagIcon size={20} />
            </button>
            <button className="text-gray-700 hover:text-pink-500 transition-colors">
              <UserIcon size={20} />
            </button>
            <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity">
              Join Now
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: 'auto'
      }} exit={{
        opacity: 0,
        height: 0
      }} className="md:hidden mt-4">
            <div className="flex flex-col space-y-4 py-4">
              <Link to="/" className="text-gray-800 hover:text-pink-500 transition-colors">
                Home
              </Link>
              <Link to="/products" className="text-gray-800 hover:text-pink-500 transition-colors">
                Products
              </Link>
              <Link to="/vendors" className="text-gray-800 hover:text-pink-500 transition-colors">
                Vendors
              </Link>
              <Link to="/about" className="text-gray-800 hover:text-pink-500 transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-gray-800 hover:text-pink-500 transition-colors">
                Contact
              </Link>
              <div className="flex items-center space-x-4 pt-2">
                <button className="text-gray-700 hover:text-pink-500 transition-colors">
                  <SearchIcon size={20} />
                </button>
                <button className="text-gray-700 hover:text-pink-500 transition-colors">
                  <ShoppingBagIcon size={20} />
                </button>
                <Link to="/login">
                  <button className="text-gray-700 hover:text-pink-500 transition-colors">
                    <UserIcon size={20} />
                  </button>
                </Link>
              </div>
              <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity text-center mt-2">
                Join Now
              </Link>
            </div>
          </motion.div>}
      </div>
    </header>;
};