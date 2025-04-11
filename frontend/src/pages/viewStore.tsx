import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, ShoppingBag, Clock, Heart, Bookmark, TrendingUpIcon, ShieldCheckIcon } from 'lucide-react';
import { Button } from '@/components/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/components/ui/tabs";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaTiktok
} from 'react-icons/fa';
import { Badge } from "@/components/components/ui/badge";

interface Hub {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  coverImage: string | null;
  verified: boolean;
  trending: boolean;
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
    category?: string;
  }[];
  services: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration?: number;
    image: string | null;
    isAvailable: boolean;
  }[];
  socials: {
    id: string;
    platform: string;
    handle: string;
    url: string;
  }[];
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const HubPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hub, setHub] = useState<Hub | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('products');

  const getImageSrc = (base64String: string | null | undefined, fallback: string) => {
    if (!base64String) return fallback;
    if (base64String.startsWith('data:image')) return base64String;
    return `data:image/jpeg;base64,${base64String}`;
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

  useEffect(() => {
    const fetchHub = async () => {
      try {
        const response = await fetch(`/api/hub/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch hub');
        }
        const data = await response.json();
        setHub(data.hub);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load hub');
      } finally {
        setLoading(false);
      }
    };

    fetchHub();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  if (!hub) {
    return (
      <div className="text-center py-12">
        <p>Hub not found</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/hubs')}
          className="mt-4"
        >
          Browse Hubs
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hubs
      </Button>

      {/* Hub Header */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <img 
          src={getImageSrc(hub.coverImage, 'https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80')}
          alt={hub.name}
          className="w-full h-64 md:h-80 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="flex items-end gap-4">
            <img 
              src={getImageSrc(hub.logo, 'https://via.placeholder.com/100?text=Logo')}
              alt={hub.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/100?text=Logo';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-white">{hub.name}</h1>
                {hub.verified && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <ShieldCheckIcon className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
                {hub.trending && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <TrendingUpIcon className="w-3 h-3" />
                    Trending
                  </Badge>
                )}
              </div>
              <p className="text-gray-200">{hub.user.firstName} {hub.user.lastName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hub Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">About</h2>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{hub.description || 'No description provided.'}</p>
            
            {/* Social Links */}
            {hub.socials.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Connect with us</h3>
                <div className="flex flex-wrap gap-2">
                  {hub.socials.map(social => (
                    <a 
                      key={social.id} 
                      href={social.url.startsWith('http') ? social.url : `https://${social.url}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {getPlatformIcon(social.platform)}
                      <span className="text-sm">@{social.handle}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Store Info</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Owner</h3>
                <p>{hub.user.firstName} {hub.user.lastName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Products</h3>
                <p>{hub.products.length} items</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Services</h3>
                <p>{hub.services.length} offerings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products & Services Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          {hub.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hub.products.map(product => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={getImageSrc(product.image, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80')}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80';
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
                    {product.category && (
                      <Badge variant="outline" className="mb-3">{product.category}</Badge>
                    )}
                    <div className="flex justify-between items-center">
                      <Button size="sm" className="gap-1">
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No products available in this store</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="services">
          {hub.services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hub.services.map(service => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={getImageSrc(service.image, 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80')}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80';
                      }}
                    />
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
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {service.duration && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.duration} min
                        </Badge>
                      )}
                      <Badge variant={service.isAvailable ? "default" : "destructive"}>
                        {service.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full gap-1"
                      disabled={!service.isAvailable}
                    >
                      <Bookmark className="w-4 h-4" />
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No services available in this store</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HubPage;