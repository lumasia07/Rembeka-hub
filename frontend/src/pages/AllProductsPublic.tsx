import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ImageIcon } from "lucide-react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from "@/components/components/ui/dialog";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaTiktok,
} from 'react-icons/fa';
import { Input } from "@/components/components/ui/input";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock?: number;
  hub?: {
    id: string;
    name: string;
    socials?: Social[];
  };
  hubId?: string;
}

interface Social {
  id: string;
  platform: string;
  handle: string;
  url: string;
  hubId: string;
}

export const ProductShowcase: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [socials, setSocials] = useState<Social[]>([]);
  const [loadingSocials, setLoadingSocials] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product/all-products`);
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!products.length) return;

    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.hub && product.hub.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleQuickView = async (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);

    const hubId = product.hub?.id || product.hubId;
    if (!hubId) return;

    try {
      if (product.hub?.socials?.length) {
        setSocials(product.hub.socials);
        return;
      }

      setLoadingSocials(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/socials/hub-socials/${hubId}`);
      const data = await response.json();
      setSocials(data);
    } catch {
      setSocials([]);
    } finally {
      setLoadingSocials(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const base = "w-6 h-6";
    switch (platform.toLowerCase()) {
      case 'instagram': return <FaInstagram className={`${base} text-pink-600`} />;
      case 'facebook': return <FaFacebook className={`${base} text-blue-600`} />;
      case 'twitter': return <FaTwitter className={`${base} text-sky-500`} />;
      case 'youtube': return <FaYoutube className={`${base} text-red-600`} />;
      case 'tiktok': return <FaTiktok className={`${base} text-black`} />;
      default: return <div className={base} />;
    }
  };

  const renderProductImage = (product: Product) => {
    if (!product.image) {
      return (
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-300" />
        </div>
      );
    }

    const imageSrc = product.image.startsWith('http') || product.image.startsWith('data:image')
      ? product.image
      : `data:image/jpeg;base64,${product.image}`;

    return <img src={imageSrc} alt={product.name} className="h-48 w-full object-cover" />;
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">All Products</h2>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-64"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <motion.div
              key={product.id}
              className="bg-gray-50 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              whileHover={{ scale: 1.02 }}
            >
              {renderProductImage(product)}
              <div className="p-4">
                <p className="text-sm text-pink-600 mb-1">{product.hub?.name || 'Vendor'}</p>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-gray-800">KES {product.price.toFixed(2)}</span>
                  <button
                    onClick={() => handleQuickView(product)}
                    className="bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find {quickViewProduct?.hub?.name || 'vendor'} online</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-4 mt-4">
            {loadingSocials ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            ) : socials.length > 0 ? (
              socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:underline"
                >
                  {getPlatformIcon(social.platform)}
                  @{social.handle}
                </a>
              ))
            ) : (
              <p className="text-gray-500">No social links found.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
