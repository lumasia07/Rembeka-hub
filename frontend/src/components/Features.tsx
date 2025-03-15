import React, { Children } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBagIcon, UsersIcon, TrendingUpIcon, GlobeIcon } from 'lucide-react';
export const Features = () => {
  const features = [{
    icon: <ShoppingBagIcon size={24} className="text-pink-500" />,
    title: 'Showcase Products',
    description: 'Display your beauty products with high-quality images and detailed descriptions to attract customers.'
  }, {
    icon: <UsersIcon size={24} className="text-pink-500" />,
    title: 'Connect with Customers',
    description: 'Build relationships with beauty enthusiasts and receive direct feedback on your products.'
  }, {
    icon: <TrendingUpIcon size={24} className="text-pink-500" />,
    title: 'Grow Your Brand',
    description: "Increase visibility and sales through our platform's marketing tools and analytics."
  }, {
    icon: <GlobeIcon size={24} className="text-pink-500" />,
    title: 'Global Reach',
    description: 'Expand your market beyond geographical boundaries and reach customers worldwide.'
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  return <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.span initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} transition={{
          duration: 0.5
        }} viewport={{
          once: true
        }} className="inline-block px-4 py-1 rounded-full bg-pink-100 text-pink-600 text-sm font-medium mb-4">
            Platform Benefits
          </motion.span>
          <motion.h2 initial={{
          opacity: 0,
          y: -20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }} viewport={{
          once: true
        }} className="text-3xl md:text-4xl font-bold mb-4">
            Why Beauty Vendors Choose Rembeka Hub
          </motion.h2>
          <motion.p initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} transition={{
          duration: 0.5,
          delay: 0.3
        }} viewport={{
          once: true
        }} className="text-gray-600 max-w-2xl mx-auto">
            Our platform offers everything you need to showcase your beauty
            products and grow your business
          </motion.p>
        </div>
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
        once: true
      }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => <motion.div key={index} variants={itemVariants} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-pink-100 w-14 h-14 rounded-lg flex items-center justify-center mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>)}
        </motion.div>
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.5
      }} viewport={{
        once: true
      }} className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to showcase your beauty products?
              </h3>
              <p className="text-gray-600 mb-6">
                Join thousands of beauty vendors who are growing their business
                on Rembeka Hub.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-md hover:opacity-90 transition-opacity">
                  Register as Vendor
                </motion.button>
                <motion.button whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="text-gray-700 border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors">
                  Learn More
                </motion.button>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <img src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" alt="Beauty products" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-pink-500/20"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>;
};