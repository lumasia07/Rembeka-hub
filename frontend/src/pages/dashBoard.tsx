import React, { useEffect, useState } from "react";
import { HubDetailsCard } from "@/components/hubDetails";
import { ServicesList } from "@/components/services";
import { ProductsList } from "@/components/products";
import GreetingHeader from "@/components/greetingDash";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/components/ui/tabs";
import { ScrollArea } from "@/components/components/ui/scroll-area";
import { Separator } from "@/components/components/ui/separator";
import { UserPlus, TrendingUp, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/components/ui/card";
import { SocialLinks } from "./SocialLinks";

interface Hub {
  id: string;
  name: string;
  description: string;
  location: string;
  logo: string | null;
  coverImage: string | null;
  services: Array<{ id: string; name: string; description: string; price: number }>;
  products: Array<{ id: string; name: string; description: string; price: number }>;
}

const Dashboard: React.FC = () => {
  const [hub, setHub] = useState<Hub | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("services");
  
  useEffect(() => {
    const fetchHubDetails = async () => {
      const token = localStorage.getItem("authToken");
      const userId = JSON.parse(localStorage.getItem("user") || "{}").id;
      
      if (!token || !userId) {
        window.location.href = "/login";
        return;
      }
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hub/user/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setHub(data.hub);
        } else {
          throw new Error("Failed to fetch hub details");
        }
      } catch (error) {
        console.error("Error fetching hub details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHubDetails();
  }, []);
  
  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <GreetingHeader onSignOut={handleSignOut} />
      
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : hub ? (
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Hub Overview Card */}
            <div className="lg:col-span-2">
              <HubDetailsCard
                name={hub.name}
                description={hub.description}
                location={hub.location}
                logo={hub.logo}
                coverImage={hub.coverImage}
              />
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Services</p>
                      <h3 className="text-2xl font-bold">{hub.services.length}</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <UserPlus className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Products</p>
                      <h3 className="text-2xl font-bold">{hub.products.length}</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Social Links</p>
                      <h3 className="text-2xl font-bold">Manage</h3>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Share2 className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Tabs 
                defaultValue="services" 
                className="w-full"
                onValueChange={(value) => setActiveTab(value)}
              >
                <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                </TabsList>
                
                <TabsContent value="services">
                  <ScrollArea className="h-full max-h-[600px] pr-4">
                    <ServicesList services={hub.services} />
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="products">
                  <ScrollArea className="h-full max-h-[600px] pr-4">
                    <ProductsList products={hub.products} />
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Social Links Sidebar */}
            <div className="lg:col-span-1">
              <Card className="shadow-md hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Share2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Social Media Links</h3>
                  </div>
                  <SocialLinks />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">No Hub Found</h2>
          <p className="text-muted-foreground">Create a hub to get started</p>
        </div>
      )}
      
      <Separator className="my-6" />
      
      <footer className="container mx-auto p-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} {hub?.name || 'Your Business'} Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;