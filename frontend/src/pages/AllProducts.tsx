import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/components/ui/card";
import { ShoppingBag, Package, Tag, Edit, Trash2, Eye, X } from "lucide-react";
import { Button } from "@/components/components/ui/button";
import { Badge } from "@/components/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/components/ui/dialog";
import { Input } from "@/components/components/ui/input";
import { Textarea } from "@/components/components/ui/textarea";
import { Label } from "@/components/components/ui/label";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
  createdAt?: string;
}

export const AllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form state for editing
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/product/all-products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/product/delete-product/${selectedProduct.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error(`Failed to delete product: ${response.status}`);

      setProducts(products.filter(p => p.id !== selectedProduct.id));
      setDeleteDialogOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error deleting product");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/product/edit-product/${selectedProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) throw new Error(`Failed to update product: ${response.status}`);

      const updatedProduct = await response.json();
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      setEditModalOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error updating product");
    }
  };

  const renderProductImage = (imageData: string) => {
    if (!imageData) return <div className="w-10 h-10 bg-gray-200 rounded-md"></div>;
    
    const base64String = imageData.startsWith('data:image') 
      ? imageData 
      : `data:image/jpeg;base64,${imageData}`;
    
    return (
      <img 
        src={base64String} 
        alt="Product" 
        className="w-10 h-10 object-cover rounded-md"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder-product.png";
          target.onerror = null;
        }}
      />
    );
  };

  return (
    <>
      <Card className="w-full border-0 shadow-md bg-card">
        {/* ... (rest of your card header and content remains the same) ... */}
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading products...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : products.length > 0 ? (
            <div className="p-6 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 flex items-center gap-1">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        {index + 1}
                      </td>
                      <td className="p-2">
                        {renderProductImage(product.image)}
                      </td>
                      <td className="p-2 font-medium flex items-center gap-1">
                        <Tag className="w-4 h-4 text-primary" />
                        {product.name}
                      </td>
                      <td className="p-2 text-sm text-muted-foreground truncate max-w-xs">
                        {product.description}
                      </td>
                      <td className="p-2">
                        <Badge variant="secondary">${product.price.toFixed(2)}</Badge>
                      </td>
                      <td className="p-2 flex gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => handleEditClick(product)}
                          aria-label={`Edit ${product.name}`}
                        >
                          <Edit className="w-4 h-4 text-primary" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => handleDeleteClick(product)}
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleView(product)}
                          aria-label={`View details of ${product.name}`}
                        >
                          <Eye className="w-4 h-4 mr-2" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {/* View Product Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-background">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Product Details</span>
              <Button variant="ghost" onClick={() => setViewModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  {selectedProduct.image ? (
                    <img
                      src={selectedProduct.image.startsWith('data:image') 
                        ? selectedProduct.image 
                        : `data:image/jpeg;base64,${selectedProduct.image}`}
                      alt={selectedProduct.name}
                      className="w-full h-64 object-contain rounded-lg bg-muted"
                    />
                  ) : (
                    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedProduct.name}</h3>
                    <Badge variant="secondary" className="mt-2">
                      ${selectedProduct.price.toFixed(2)}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
                    <p className="mt-1">{selectedProduct.description}</p>
                  </div>
                  {selectedProduct.category && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Category</h4>
                      <p className="mt-1">{selectedProduct.category}</p>
                    </div>
                  )}
                  {selectedProduct.stock !== undefined && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Stock</h4>
                      <p className="mt-1">{selectedProduct.stock} units</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-background">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image
                </Label>
                <div className="col-span-3">
                  {editForm.image && (
                    <img
                      src={editForm.image.startsWith('data:image') 
                        ? editForm.image 
                        : `data:image/jpeg;base64,${editForm.image}`}
                      alt="Product preview"
                      className="w-32 h-32 object-contain mb-2 rounded-lg bg-muted"
                    />
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setEditForm({...editForm, image: event.target.result as string});
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};