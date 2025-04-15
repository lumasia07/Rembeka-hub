import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon, SearchIcon, ShoppingBagIcon, UserIcon } from 'lucide-react';
import { Button } from "@/components/components/ui/button";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserIconClick = () => {
    navigate('/login');
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
            >
              Rembeka Hub
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* <Link to="/" className="text-gray-800 hover:text-pink-500 transition-colors">
              Home
            </Link> */}
            <Link to="/products" className="text-white hover:text-pink-500 transition-colors">
              Products
            </Link>
            <Link to="/services" className="text-white hover:text-pink-500 transition-colors">
              Services
            </Link>
            <Link to="/vendors" className="text-white hover:text-pink-500 transition-colors">
              Vendors
            </Link>
            {/* <Link to="/contact" className="text-gray-800 hover:text-pink-500 transition-colors">
              Contact
            </Link> */}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <Button variant="ghost" size="icon" className="text-gray-700 hover:text-pink-500">
              <SearchIcon className="h-5 w-5" />
            </Button> */}
            {/* <Button variant="ghost" size="icon" className="text-gray-700 hover:text-pink-500">
              <ShoppingBagIcon className="h-5 w-5" />
            </Button> */}
            {/* <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-700 hover:text-pink-500"
              onClick={handleUserIconClick}
            >
              <UserIcon className="h-5 w-5" />
            </Button> */}
             <Button 
              asChild
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90"
            >
              <Link to="/login">
                Login
              </Link>
            </Button>

            <Button 
              asChild
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90"
            >
              <Link to="/register">
                Join Now
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4"
          >
            <div className="flex flex-col space-y-4 py-4">
              <Link 
                to="/" 
                className="text-gray-800 hover:text-pink-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-800 hover:text-pink-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/vendors" 
                className="text-gray-800 hover:text-pink-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Vendors
              </Link>
              <Link 
                to="/services" 
                className="text-gray-800 hover:text-pink-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-800 hover:text-pink-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="flex items-center justify-center space-x-4 pt-2">
                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-pink-500">
                  <SearchIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-pink-500">
                  <ShoppingBagIcon className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-700 hover:text-pink-500"
                  onClick={handleUserIconClick}
                >
                  <UserIcon className="h-5 w-5" />
                </Button>
              </div>
              
              <Button 
                asChild
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-90 mt-2"
              >
                <Link to="/register">
                  Join Now
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};