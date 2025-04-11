import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/components/ui/card";
import { ShoppingBag, Heart, Search, X } from "lucide-react";
import { Button } from "@/components/components/ui/button";
import { Input } from "@/components/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  image: string;
  category?: string;
  stock?: number;
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
  const [socialError, setSocialError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product/all-products`);
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!products || products.length === 0) return;
    
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.hub && product.hub.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered || []);
    }
  }, [searchTerm, products]);

  const handleQuickView = async (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
    
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
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/socials/hub-socials/${hubId}`, {
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

  const getImageSrc = (image: string | null, fallback: string) => {
    if (!image) return fallback;
    if (image.startsWith('data:image')) return image;
    return `data:image/jpeg;base64,${image}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Our Products</h1>
        <p className="text-gray-600 mb-6">
          Discover amazing products from our trusted vendors
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <div 
              className="relative h-48 overflow-hidden group cursor-pointer"
              onClick={() => handleQuickView(product)}
            >
              <img
                src={getImageSrc(product.image, 'https://via.placeholder.com/300?text=Product')}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/300?text=Product';
                }}
              />
              <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm">
                <Heart className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-pointer" />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{product.name}</h3>
                <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm text-gray-600">{product.hub?.name || 'Vendor'}</span>
                </div>
                <Button 
                  size="sm" 
                  className="gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle add to cart logic here
                  }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your search</p>
          <Button 
            variant="outline" 
            onClick={() => setSearchTerm('')}
            className="mt-4"
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Quick View Modal */}
      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="sm:max-w-4xl">
          {quickViewProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-left">{quickViewProduct.name}</DialogTitle>
                <button 
                  onClick={() => setIsQuickViewOpen(false)}
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative h-96">
                  <img
                    src={getImageSrc(quickViewProduct.image, 'https://via.placeholder.com/500?text=Product')}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/500?text=Product';
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold">{quickViewProduct.name}</h2>
                    <span className="text-2xl font-bold text-primary">${quickViewProduct.price.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600">{quickViewProduct.description}</p>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Vendor:</span> {quickViewProduct.hub?.name || 'Unknown'}
                    </p>
                    {quickViewProduct.category && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Category:</span> {quickViewProduct.category}
                      </p>
                    )}
                  </div>

                  {/* Social Media Links Section */}
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-3">Connect with Vendor</h3>
                    {loadingSocials ? (
                      <div className="flex justify-center py-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : socialError ? (
                      <p className="text-sm text-red-500">{socialError}</p>
                    ) : socials.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {socials.map((social) => (
                          <a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            {getPlatformIcon(social.platform)}
                            <span className="text-sm">@{social.handle}</span>
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No social media links available</p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button className="flex-1" size="lg">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" className="flex-1" size="lg">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductShowcase;