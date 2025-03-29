import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/components/ui/card";
import { ShoppingBag, Package, Tag, PlusCircle, ChevronRight, Eye, X } from "lucide-react";
import { Button } from "@/components/components/ui/button";
import { Badge } from "@/components/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  stock?: number;
  category?: string;
  createdAt?: string;
}

const ProductsList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/product/all-products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error fetching products");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderImage = (image?: string, className = "") => {
    if (!image) {
      return (
        <div className={`bg-muted/50 flex items-center justify-center ${className}`}>
          <Package className="w-12 h-12 text-muted-foreground/30" />
        </div>
      );
    }

    const imageSrc = image.startsWith('data:image') 
      ? image 
      : `data:image/jpeg;base64,${image}`;

    return (
      <img 
        src={imageSrc}
        alt="Product"
        className={`object-cover ${className}`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = '';
          target.className = `bg-muted/50 flex items-center justify-center ${className}`;
          target.innerHTML = '<Package className="w-12 h-12 text-muted-foreground/30" />';
        }}
      />
    );
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <Card className="w-full border-0 shadow-md bg-card">
        <CardHeader className="pb-3 border-b">
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-24 mt-4" />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full border-0 shadow-md bg-card">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Products
            </CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button 
                size="sm" 
                variant="ghost" 
                className="gap-1 w-full sm:w-auto" 
                onClick={() => navigate("/add-product")}
              >
                <PlusCircle className="w-4 h-4" /> Add Product
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-1 w-full sm:w-auto" 
                onClick={() => navigate("/all-products")}
              >
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="p-8 text-center text-red-500">
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="overflow-hidden h-48">
                    {renderImage(product.image, "w-full h-full hover:scale-105 transition-transform duration-300")}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                      <Badge variant="secondary" className="ml-2 whitespace-nowrap">
                        ${product.price.toFixed(2)}
                      </Badge>
                    </div>
                    {product.category && (
                      <Badge variant="outline" className="mb-2 text-xs">
                        {product.category}
                      </Badge>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{product.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Tag className="w-3 h-3 mr-1" />
                        <span>
                          {product.stock !== undefined ? `${product.stock} in stock` : 'In stock'}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 group-hover:bg-primary/10"
                        onClick={() => openProductModal(product)}
                      >
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No products available</h3>
              <p className="text-muted-foreground mb-4">Start by adding products to your hub.</p>
              <Button onClick={() => navigate("/add-product")}>Add Product</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl bg-background">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Product Details</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg overflow-hidden">
                {renderImage(selectedProduct.image, "w-full h-64 md:h-80 object-cover")}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
                  <Badge variant="secondary" className="text-lg">
                    ${selectedProduct.price.toFixed(2)}
                  </Badge>
                </div>
                
                {selectedProduct.category && (
                  <Badge variant="outline">{selectedProduct.category}</Badge>
                )}
                
                <div className="space-y-2">
                  <h3 className="font-medium">Description</h3>
                  <p className="text-muted-foreground">{selectedProduct.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Stock Status</p>
                    <p className="font-medium">
                      {selectedProduct.stock !== undefined 
                        ? `${selectedProduct.stock} available` 
                        : 'In stock'}
                    </p>
                  </div>
                  
                  {selectedProduct.createdAt && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Added On</p>
                      <p className="font-medium">
                        {new Date(selectedProduct.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsModalOpen(false);
                      navigate(`/edit-product/${selectedProduct.id}`);
                    }}
                  >
                    Edit Product
                  </Button>
                  <Button className="flex-1">Add to Cart</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductsList;