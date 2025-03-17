import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/components/ui/card";
import { ShoppingBag, Package, Tag, PlusCircle } from "lucide-react";
import { Button } from "@/components/components/ui/button";
import { Badge } from "@/components/components/ui/badge";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface ProductsListProps {
  products: Product[];
}

export const ProductsList: React.FC<ProductsListProps> = ({ products }) => {
  return (
    <Card className="w-full border-0 shadow-md bg-card">
      <CardHeader className="pb-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Products
          </CardTitle>
          <Button size="sm" variant="ghost" className="gap-1">
            <PlusCircle className="w-4 h-4" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden border border-border/50 hover:border-border hover:shadow-md transition-all duration-200">
                <div className="h-32 bg-muted flex items-center justify-center">
                  <Package className="w-12 h-12 text-muted-foreground/50" />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{product.name}</h3>
                    <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                      ${product.price}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Tag className="w-3 h-3 mr-1" />
                      <span>In stock</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-8">View</Button>
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
            <Button>Add Product</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};