import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/components/ui/card";
import { ShoppingBag, Package, Tag, PlusCircle, ChevronRight, Eye, Clock } from "lucide-react";
import { Button } from "@/components/components/ui/button";
import { Badge } from "@/components/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/components/ui/skeleton";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number;
  image?: string;
  isAvailable: boolean;
}

export const ServicesList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/service/all-services`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status}`);
        }

        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error fetching services");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const renderImage = (service: Service) => {
    if (!service.image) {
      return (
        <div className="h-48 bg-muted/50 flex items-center justify-center">
          <Package className="w-12 h-12 text-muted-foreground/30" />
        </div>
      );
    }

    // Handle both base64 and URL images
    const imageSrc = service.image.startsWith('data:image') 
      ? service.image 
      : `data:image/jpeg;base64,${service.image}`;

    return (
      <img 
        src={imageSrc}
        alt={service.name}
        className="h-48 w-full object-cover hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '';
          target.className = 'h-48 bg-muted/50 flex items-center justify-center';
          target.innerHTML = '<Package className="w-12 h-12 text-muted-foreground/30" />';
        }}
      />
    );
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
    <Card className="w-full border-0 shadow-md bg-card">
      <CardHeader className="pb-3 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Services
          </CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              size="sm" 
              variant="ghost" 
              className="gap-1 w-full sm:w-auto" 
              onClick={() => navigate("/add-service")}
            >
              <PlusCircle className="w-4 h-4" /> Add Service
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="gap-1 w-full sm:w-auto" 
              onClick={() => navigate("/all-services")}
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
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className="overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-200 group"
              >
                <div className="overflow-hidden">
                  {renderImage(service)}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg line-clamp-1">{service.name}</h3>
                    <Badge variant="secondary" className="ml-2 whitespace-nowrap">
                      ${service.price.toFixed(2)}
                    </Badge>
                  </div>
                  {service.duration && (
                    <Badge variant="outline" className="mb-2 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {service.duration} mins
                    </Badge>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{service.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Tag className="w-3 h-3 mr-1" />
                      <span>
                        {service.isAvailable ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 group-hover:bg-primary/10"
                      onClick={() => navigate(`/service/${service.id}`)}
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
            <h3 className="text-lg font-medium mb-2">No services available</h3>
            <p className="text-muted-foreground mb-4">Start by adding services to your hub.</p>
            <Button onClick={() => navigate("/add-service")}>Add Service</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};