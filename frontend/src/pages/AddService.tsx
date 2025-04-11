import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/components/ui/input";
import { Button } from "@/components/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/components/ui/card";
import { Label } from "@/components/components/ui/label";
import { Textarea } from "@/components/components/ui/textarea";
import { Checkbox } from "@/components/components/ui/checkbox";
import { Loader2, Image as ImageIcon, X, Clock } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateServiceForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    image: null as File | null,
    isAvailable: true,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Service name is required";
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price))) {
      newErrors.price = "Price must be a number";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (formData.duration && isNaN(Number(formData.duration))) {
      newErrors.duration = "Duration must be a number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isAvailable: checked,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image file
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: "Please upload an image file" }));
        return;
      }
      
      setFormData((prev) => ({ ...prev, image: file }));
      setErrors(prev => ({ ...prev, image: "" }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("description", formData.description);
    submissionData.append("price", formData.price);
    submissionData.append("duration", formData.duration);
    submissionData.append("isAvailable", formData.isAvailable.toString());
    if (formData.image) {
      submissionData.append("image", formData.image);
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/service/add-service`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: submissionData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add service");
      }

      toast.success("Service added successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        image: null,
        isAvailable: true,
      });
      setImagePreview(null);
      
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to add service", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <Card className="max-w-lg mx-auto mt-10 p-6 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Add New Service</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter service name" 
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="Enter description" 
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input 
                  id="price" 
                  type="number" 
                  step="0.01" 
                  min="0.01"
                  value={formData.price} 
                  onChange={handleChange} 
                  placeholder="0.00"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <div className="relative">
                  <Input 
                    id="duration" 
                    type="number" 
                    min="1"
                    value={formData.duration} 
                    onChange={handleChange} 
                    placeholder="e.g. 30"
                    className={errors.duration ? "border-red-500" : ""}
                  />
                  <Clock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.duration && <p className="text-sm text-red-500">{errors.duration}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Service Image</Label>
              <div className="flex flex-col gap-4">
                {imagePreview ? (
                  <div className="relative group">
                    <img 
                      src={imagePreview} 
                      alt="Service preview" 
                      className="w-full h-48 object-contain rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, image: null }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
                    <div className="text-center p-4">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload an image
                      </p>
                    </div>
                  </div>
                )}
                <Input 
                  id="image" 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image')?.click()}
                >
                  Choose Image
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox 
                id="isAvailable" 
                checked={formData.isAvailable} 
                onCheckedChange={handleCheckboxChange} 
              />
              <Label htmlFor="isAvailable">This service is currently available</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Service"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}