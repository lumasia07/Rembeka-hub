import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, AwardIcon, TrendingUpIcon } from 'lucide-react';
export const VendorShowcase = () => {
  const vendors = [{
    id: 1,
    name: 'Glow Cosmetics',
    image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    productCount: 48,
    rating: 4.8,
    verified: true,
    trending: true
  }, {
    id: 2,
    name: 'Pure Beauty',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    productCount: 32,
    rating: 4.7,
    verified: true,
    trending: false
  }, {
    id: 3,
    name: 'Luxe Skincare',
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    productCount: 56,
    rating: 4.9,
    verified: true,
    trending: true
  }];
  return <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <motion.h2 initial={{
            opacity: 0,
            y: -20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} viewport={{
            once: true
          }} className="text-3xl md:text-4xl font-bold mb-4">
              Top Beauty Vendors
            </motion.h2>
            <motion.p initial={{
            opacity: 0
          }} whileInView={{
            opacity: 1
          }} transition={{
            duration: 0.5,
            delay: 0.2
          }} viewport={{
            once: true
          }} className="text-gray-600 max-w-2xl">
              Discover premium beauty brands that are making waves in the
              industry
            </motion.p>
          </div>
          <motion.a href="#" initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} transition={{
          duration: 0.5,
          delay: 0.3
        }} viewport={{
          once: true
        }} className="text-pink-600 font-medium flex items-center mt-4 md:mt-0">
            View all vendors
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
              <path d="M4.16663 10H15.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10.8334 5L15.8334 10L10.8334 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vendors.map((vendor, index) => <motion.div key={vendor.id} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }} viewport={{
          once: true
        }} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-48 overflow-hidden">
                <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{vendor.name}</h3>
                  <div className="flex items-center">
                    {vendor.verified && <div className="mr-2 text-blue-600 bg-blue-100 p-1 rounded-full" title="Verified Vendor">
                        <ShieldCheckIcon size={16} />
                      </div>}
                    {vendor.trending && <div className="text-orange-600 bg-orange-100 p-1 rounded-full" title="Trending">
                        <TrendingUpIcon size={16} />
                      </div>}
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <svg key={i} className={`w-4 h-4 ${i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>)}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">
                    ({vendor.rating})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AwardIcon size={16} className="text-pink-500 mr-1" />
                    <span className="text-sm text-gray-600">
                      {vendor.productCount} Products
                    </span>
                  </div>
                  <motion.button whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-md text-sm">
                    View Store
                  </motion.button>
                </div>
              </div>
            </motion.div>)}
        </div>
      </div>
    </section>;
};