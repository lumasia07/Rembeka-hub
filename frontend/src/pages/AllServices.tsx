import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/components/ui/card";
import { ShoppingBag, Package, Tag, Edit, Trash2, Eye, X, Clock } from "lucide-react";
import { Button } from "@/components/components/ui/button";
import { Badge } from "@/components/components/ui/badge";
import { Checkbox } from "@/components/components/ui/checkbox";
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

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number;
  image?: string;
  isAvailable: boolean;
  createdAt?: string;
}

export const AllServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Form state for editing
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 0,
    image: "",
    isAvailable: true,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/service/my-services`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) throw new Error(`Failed to fetch services: ${response.status}`);
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error fetching services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleView = (service: Service) => {
    setSelectedService(service);
    setViewModalOpen(true);
  };

  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setEditForm({
      name: service.name,
      description: service.description || "",
      price: service.price,
      duration: service.duration || 0,
      image: service.image || "",
      isAvailable: service.isAvailable,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedService) return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/service/delete-service/${selectedService.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (!response.ok) throw new Error(`Failed to delete service: ${response.status}`);

      setServices(services.filter(s => s.id !== selectedService.id));
      setDeleteDialogOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error deleting service");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/service/edit-service/${selectedService.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) throw new Error(`Failed to update service: ${response.status}`);

      const updatedService = await response.json();
      setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
      setEditModalOpen(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error updating service");
    }
  };

  const renderServiceImage = (imageData?: string) => {
    if (!imageData) return <div className="w-10 h-10 bg-gray-200 rounded-md"></div>;
    
    const base64String = imageData.startsWith('data:image') 
      ? imageData 
      : `data:image/jpeg;base64,${imageData}`;
    
    return (
      <img 
        src={base64String} 
        alt="Service" 
        className="w-10 h-10 object-cover rounded-md"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder-service.png";
          target.onerror = null;
        }}
      />
    );
  };

  return (
    <>
      <Card className="w-full border-0 shadow-md bg-card">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Loading services...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : services.length > 0 ? (
            <div className="p-6 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">#</th>
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Price</th>
                    <th className="p-2 text-left">Duration</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={service.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 flex items-center gap-1">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        {index + 1}
                      </td>
                      <td className="p-2">
                        {renderServiceImage(service.image)}
                      </td>
                      <td className="p-2 font-medium flex items-center gap-1">
                        <Tag className="w-4 h-4 text-primary" />
                        {service.name}
                      </td>
                      <td className="p-2 text-sm text-muted-foreground truncate max-w-xs">
                        {service.description}
                      </td>
                      <td className="p-2">
                        <Badge variant="secondary">${service.price.toFixed(2)}</Badge>
                      </td>
                      <td className="p-2">
                        {service.duration ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {service.duration} mins
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </td>
                      <td className="p-2">
                        <Badge variant={service.isAvailable ? "default" : "destructive"}>
                          {service.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </td>
                      <td className="p-2 flex gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => handleEditClick(service)}
                          aria-label={`Edit ${service.name}`}
                        >
                          <Edit className="w-4 h-4 text-primary" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => handleDeleteClick(service)}
                          aria-label={`Delete ${service.name}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleView(service)}
                          aria-label={`View details of ${service.name}`}
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
              <h3 className="text-lg font-medium mb-2">No services available</h3>
              <p className="text-muted-foreground mb-4">Start by adding services to your hub.</p>
              <Button onClick={() => navigate("/add-service")}>Add Service</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Service Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-background">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Service Details</span>
              <Button variant="ghost" onClick={() => setViewModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  {selectedService.image ? (
                    <img
                      src={selectedService.image.startsWith('data:image') 
                        ? selectedService.image 
                        : `data:image/jpeg;base64,${selectedService.image}`}
                      alt={selectedService.name}
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
                    <h3 className="text-2xl font-bold">{selectedService.name}</h3>
                    <Badge variant="secondary" className="mt-2">
                      ${selectedService.price.toFixed(2)}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
                    <p className="mt-1">{selectedService.description || "No description provided"}</p>
                  </div>
                  {selectedService.duration && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Duration</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <p>{selectedService.duration} minutes</p>
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                    <Badge 
                      variant={selectedService.isAvailable ? "default" : "destructive"} 
                      className="mt-1"
                    >
                      {selectedService.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
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
              Are you sure you want to delete "{selectedService?.name}"? This action cannot be undone.
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

      {/* Edit Service Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-2xl bg-background">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
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
                  step="0.01"
                  min="0"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration" className="text-right">
                  Duration (mins)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="0"
                  value={editForm.duration}
                  onChange={(e) => setEditForm({...editForm, duration: parseInt(e.target.value) || 0})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isAvailable" className="text-right">
                  Available
                </Label>
                <div className="col-span-3">
                  <Checkbox
                    id="isAvailable"
                    checked={editForm.isAvailable}
                    onCheckedChange={(checked) => 
                      setEditForm({...editForm, isAvailable: checked as boolean})
                    }
                  />
                  <Label htmlFor="isAvailable" className="ml-2">
                    Service is currently available
                  </Label>
                </div>
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
                      alt="Service preview"
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