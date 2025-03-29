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

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
  hub?: {
    name: string;
  };
}

export const ProductShowcase: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/product/all-products");
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

  const getImageSrc = (image: string | null, fallback: string) => {
    if (!image) return fallback;
    if (image.startsWith('data:image')) return image;
    return `data:image/jpeg;base64,${image}`;
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
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
                <Button size="sm" className="gap-1">
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