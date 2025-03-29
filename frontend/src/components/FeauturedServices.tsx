import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, HeartIcon, StarIcon, Loader2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number;
  image?: string;
  isAvailable: boolean;
  hub?: {
    name: string;
  };
  rating?: number;
}

export const FeaturedServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/service/all-services', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }

        const data = await response.json();
        // Filter available services and take first 4 as featured
        const availableServices = data.filter((s: Service) => s.isAvailable);
        setServices(availableServices.slice(0, 4));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Popular Beauty Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Discover the most sought-after beauty services from our top professionals
          </motion.p>
        </div>

        {services.length > 0 ? (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {services.map(service => (
              <motion.div 
                key={service.id} 
                variants={itemVariants} 
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-64 overflow-hidden group">
                  <img 
                    src={service.image || 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm">
                    <HeartIcon size={18} className="text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-pink-600 font-medium mb-1">
                    {service.hub?.name || 'Professional'}
                  </p>
                  <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    {service.duration && (
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon size={16} className="mr-1" />
                        {service.duration} mins
                      </div>
                    )}
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon 
                            key={i} 
                            size={16} 
                            className={i < Math.floor(service.rating || 4.5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-1">
                        ({service.rating?.toFixed(1) || '4.5'})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">
                      ${service.price.toFixed(2)}
                    </span>
                    <button 
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        service.isAvailable 
                          ? 'bg-pink-500 hover:bg-pink-600 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!service.isAvailable}
                    >
                      {service.isAvailable ? 'Book Now' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured services available</p>
          </div>
        )}

        <div className="text-center mt-10">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-pink-600 border border-pink-200 px-6 py-3 rounded-md hover:bg-pink-50 transition-colors inline-flex items-center gap-2"
            onClick={() => window.location.href = '/all-services'}
          >
            View All Services
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.66663 4L12.6666 8L8.66663 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
};