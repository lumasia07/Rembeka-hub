import React, { Children } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBagIcon, HeartIcon, StarIcon } from 'lucide-react';
export const FeaturedProducts = () => {
  const products = [{
    id: 1,
    name: 'Luminous Glow Serum',
    vendor: 'Glow Cosmetics',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    rating: 4.8
  }, {
    id: 2,
    name: 'Hydra Boost Moisturizer',
    vendor: 'Pure Beauty',
    price: 38.5,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    rating: 4.7
  }, {
    id: 3,
    name: 'Revitalizing Eye Cream',
    vendor: 'Luxe Skincare',
    price: 65.0,
    image: 'https://images.unsplash.com/photo-1631730359585-93c2f359a932?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    rating: 4.9
  }, {
    id: 4,
    name: 'Natural Blush Palette',
    vendor: 'Eco Beauty',
    price: 42.99,
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    rating: 4.6
  }];
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
  return <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
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
            Trending Beauty Products
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
        }} className="text-gray-600 max-w-2xl mx-auto">
            Discover the most sought-after beauty products from our top vendors
          </motion.p>
        </div>
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
        once: true
      }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map(product => <motion.div key={product.id} variants={itemVariants} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="relative h-64 overflow-hidden group">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm">
                  <HeartIcon size={18} className="text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-pink-600 font-medium mb-1">
                  {product.vendor}
                </p>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <div className="flex items-center mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} size={16} className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />)}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">
                    ({product.rating})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">
                    ${product.price.toFixed(2)}
                  </span>
                  <button className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg transition-colors">
                    <ShoppingBagIcon size={18} />
                  </button>
                </div>
              </div>
            </motion.div>)}
        </motion.div>
        <div className="text-center mt-10">
          <motion.button whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} className="bg-white text-pink-600 border border-pink-200 px-6 py-3 rounded-md hover:bg-pink-50 transition-colors inline-flex items-center gap-2">
            View All Products
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.66663 4L12.6666 8L8.66663 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>
      </div>
    </section>;
};