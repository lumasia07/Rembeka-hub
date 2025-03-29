import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/components/ui/card";
import { Clock, Heart, Search, X, Bookmark } from "lucide-react";
import { Button } from "@/components/components/ui/button";
import { Input } from "@/components/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/components/ui/dialog";
import { Badge } from "@/components/components/ui/badge";

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
}

export const ServiceShowcase: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quickViewService, setQuickViewService] = useState<Service | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/service/all-services");
        if (!response.ok) throw new Error(`Failed to fetch services: ${response.status}`);
        const data = await response.json();
        setServices(data);
        setFilteredServices(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error fetching services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (!services || services.length === 0) return;
    
    if (searchTerm.trim() === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (service.hub && service.hub.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredServices(filtered || []);
    }
  }, [searchTerm, services]);

  const getImageSrc = (image: string | null, fallback: string) => {
    if (!image) return fallback;
    if (image.startsWith('data:image')) return image;
    return `data:image/jpeg;base64,${image}`;
  };

  const handleQuickView = (service: Service) => {
    setQuickViewService(service);
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
        <h1 className="text-3xl font-bold mb-4">Our Services</h1>
        <p className="text-gray-600 mb-6">
          Discover premium beauty services from our trusted professionals
        </p>
        
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search services..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <div 
              className="relative h-48 overflow-hidden group cursor-pointer"
              onClick={() => handleQuickView(service)}
            >
              <img
                src={getImageSrc(service.image, 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80')}
                alt={service.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
                }}
              />
              <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm">
                <Heart className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-pointer" />
              </div>
              {!service.isAvailable && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-bold">Currently Unavailable</span>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{service.name}</h3>
                <span className="font-bold text-primary">${service.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2">{service.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {service.duration && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration} min
                    </div>
                  )}
                </div>
                <Button 
                  size="sm" 
                  className="gap-1"
                  disabled={!service.isAvailable}
                >
                  <Bookmark className="w-4 h-4" />
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-500">No services found matching your search</p>
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
          {quickViewService && (
            <>
              <DialogHeader>
                <DialogTitle className="text-left">{quickViewService.name}</DialogTitle>
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
                    src={getImageSrc(quickViewService.image, 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80')}
                    alt={quickViewService.name}
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold">{quickViewService.name}</h2>
                    <span className="text-2xl font-bold text-primary">${quickViewService.price.toFixed(2)}</span>
                  </div>
                  <p className="text-gray-600">{quickViewService.description}</p>
                  
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center gap-4">
                      {quickViewService.duration && (
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{quickViewService.duration} minutes</span>
                        </div>
                      )}
                      <Badge variant={quickViewService.isAvailable ? "default" : "destructive"}>
                        {quickViewService.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Professional:</span> {quickViewService.hub?.name || 'Not specified'}
                    </p>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <Button 
                      className="flex-1" 
                      size="lg"
                      disabled={!quickViewService.isAvailable}
                    >
                      Book Appointment
                    </Button>
                    <Button variant="outline" className="flex-1" size="lg">
                      <Heart className="mr-2 h-4 w-4" />
                      Save for Later
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

export default ServiceShowcase;