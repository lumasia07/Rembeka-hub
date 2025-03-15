import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
export const Hero = () => {
  return <section className="pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8
        }} className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <span className="inline-block px-4 py-1 rounded-full bg-pink-100 text-pink-600 text-sm font-medium mb-6">
              Beauty Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Showcase Your Beauty Products on
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                {' '}
                Rembeka Hub
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Connect with customers, showcase your beauty products, and grow
              your brand on the premier platform for beauty vendors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-md hover:opacity-90 transition-opacity text-center">
                Join as Vendor
              </Link>
              <Link to="/products" className="flex items-center justify-center gap-2 text-pink-600 border border-pink-200 px-8 py-3 rounded-md hover:bg-pink-50 transition-colors text-center">
                Explore Products <ArrowRightIcon size={18} />
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="w-full lg:w-1/2 relative">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-pink-100 rounded-full opacity-60 z-0"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-100 rounded-full opacity-60 z-0"></div>
              <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Beauty products showcase" className="rounded-2xl shadow-xl relative z-10 w-full object-cover aspect-[4/3]" />
              <motion.div initial={{
              y: 20,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} transition={{
              delay: 0.8,
              duration: 0.5
            }} className="absolute -bottom-5 -left-5 md:bottom-10 md:left-10 bg-white p-4 rounded-lg shadow-lg z-20">
                <div className="flex items-center gap-3">
                  <div className="bg-pink-500 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold">
                    1K+
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Vendors</p>
                    <p className="font-bold">Join Community</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{
              y: 20,
              opacity: 0
            }} animate={{
              y: 0,
              opacity: 1
            }} transition={{
              delay: 1,
              duration: 0.5
            }} className="absolute -top-5 -right-5 md:top-10 md:right-10 bg-white p-4 rounded-lg shadow-lg z-20">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold">
                    10K+
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Products Listed</p>
                    <p className="font-bold">Explore Now</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>;
};