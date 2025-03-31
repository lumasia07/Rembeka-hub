import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBagIcon, HeartIcon, StarIcon, Loader2, X, ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/components/ui/dialog";
import { 
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaTiktok
} from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  hub?: {
    id: string;
    name: string;
    socials?: {
      id: string;
      platform: string;
      handle: string;
      url: string;
    }[];
  };
  hubId?: string;
  rating?: number;
}

interface Social {
  id: string;
  platform: string;
  handle: string;
  url: string;
  hubId: string;
}

export const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socials, setSocials] = useState<Social[]>([]);
  const [loadingSocials, setLoadingSocials] = useState(false);
  const [socialError, setSocialError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/product/all-products', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data.slice(0, 4));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = async (product: Product) => {
    setSelectedProduct(product);
    setIsSocialModalOpen(true);
    
    try {
      // First check if socials are already in the product data
      if (product.hub?.socials?.length) {
        const formattedSocials = product.hub.socials.map(social => ({
          ...social,
          url: social.url.startsWith('http') ? social.url : `https://${social.url}`,
          hubId: product.hub?.id || product.hubId || ''
        }));
        setSocials(formattedSocials);
        return;
      }

      // Only fetch if we have a hubId
      const hubId = product.hub?.id || product.hubId;
      if (!hubId) {
        setSocials([]);
        setSocialError("No hub associated with this product");
        return;
      }

      setLoadingSocials(true);
      setSocialError(null);
      
      const response = await fetch(`http://localhost:3000/api/socials/hub-socials/${hubId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch social media links');
      }

      const data = await response.json();
      
      // Ensure URLs have https:// and include hubId
      const formattedSocials = data.map((social: Social) => ({
        ...social,
        url: social.url.startsWith('http') ? social.url : `https://${social.url}`,
        hubId: hubId
      }));
      
      setSocials(formattedSocials);
    } catch (err) {
      console.error('Error fetching socials:', err);
      setSocialError(err instanceof Error ? err.message : 'Failed to load social media links');
    } finally {
      setLoadingSocials(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const iconClass = "w-5 h-5";
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <FaInstagram className={`${iconClass} text-pink-600`} />;
      case 'facebook':
        return <FaFacebook className={`${iconClass} text-blue-600`} />;
      case 'twitter':
        return <FaTwitter className={`${iconClass} text-blue-400`} />;
      case 'youtube':
        return <FaYoutube className={`${iconClass} text-red-600`} />;
      case 'tiktok':
        return <FaTiktok className={`${iconClass} text-black`} />;
      default:
        return <div className={`${iconClass} text-gray-600`} />;
    }
  };

  const renderProductImage = (product: Product) => {
    if (!product.image) {
      return (
        <div className="h-64 w-full bg-gray-100 flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-300" />
        </div>
      );
    }

    // Handle both URL and base64 images
    const imageSrc = product.image.startsWith('http') 
      ? product.image 
      : product.image.startsWith('data:image')
        ? product.image
        : `data:image/jpeg;base64,${product.image}`;

    return (
      <img
        src={imageSrc}
        alt={product.name}
        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = '';
          target.className = 'h-64 w-full bg-gray-100 flex items-center justify-center';
          target.innerHTML = '<ImageIcon className="w-12 h-12 text-gray-300" />';
        }}
      />
    );
  };

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
            Trending Beauty Products
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Discover the most sought-after beauty products from our top vendors
          </motion.p>
        </div>

        {products.length > 0 ? (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {products.map(product => (
              <motion.div 
                key={product.id} 
                variants={itemVariants} 
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <div className="relative h-64 overflow-hidden group">
                  {renderProductImage(product)}
                  <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm">
                    <HeartIcon size={18} className="text-gray-400 hover:text-pink-500 cursor-pointer transition-colors" />
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-pink-600 font-medium mb-1">
                    {product.hub?.name || 'Vendor'}
                  </p>
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          size={16} 
                          className={i < Math.floor(product.rating || 4.5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-1">
                      ({product.rating?.toFixed(1) || '4.5'})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">
                      ${product.price.toFixed(2)}
                    </span>
                    <button 
                      className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle add to cart logic here
                      }}
                    >
                      <ShoppingBagIcon size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured products available</p>
          </div>
        )}

        {/* Social Media Modal */}
        <Dialog open={isSocialModalOpen} onOpenChange={setIsSocialModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>{selectedProduct?.hub?.name || 'Vendor'} Socials</span>
                <button 
                  onClick={() => setIsSocialModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close social media dialog"
                >
                  <X className="h-5 w-5" />
                </button>
              </DialogTitle>
              <DialogDescription>
                Connect with this vendor on social media
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {loadingSocials ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : socialError ? (
                <p className="text-center text-red-500 py-4">{socialError}</p>
              ) : socials.length > 0 ? (
                socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {getPlatformIcon(social.platform)}
                    <div>
                      <p className="font-medium">{social.platform}</p>
                      <p className="text-sm text-gray-500">@{social.handle}</p>
                    </div>
                  </a>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No social media links available
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div className="text-center mt-10">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-pink-600 border border-pink-200 px-6 py-3 rounded-md hover:bg-pink-50 transition-colors inline-flex items-center gap-2"
            onClick={() => window.location.href = '/products'}
          >
            View All Products
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