import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, ShoppingBag, Heart, Star } from 'lucide-react';
import { Button } from '@/components/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/components/ui/card';

interface Hub {
  id: string;
  name: string;
  description: string;
  logo: string | null;
  coverImage: string | null;
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
  }[];
  services: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
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

  const getImageSrc = (base64String: string | null | undefined, fallback: string) => {
    if (!base64String) return fallback;
    if (base64String.startsWith('data:image')) return base64String;
    return `data:image/jpeg;base64,${base64String}`;
  };

  useEffect(() => {
    const fetchHub = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/hub/${id}`);
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
          src={getImageSrc(hub.coverImage, 'https://via.placeholder.com/1200x400?text=Hub+Cover')}
          alt={hub.name}
          className="w-full h-64 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/1200x400?text=Hub+Cover';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="flex items-end gap-4">
            <img 
              src={getImageSrc(hub.logo, 'https://via.placeholder.com/100?text=Logo')}
              alt={hub.name}
              className="w-20 h-20 rounded-full border-4 border-white object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/100?text=Logo';
              }}
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{hub.name}</h1>
              <p className="text-gray-200">{hub.user.firstName} {hub.user.lastName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hub Description */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-semibold">About</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{hub.description || 'No description provided.'}</p>
        </CardContent>
      </Card>

      {/* Products Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        {hub.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hub.products.map(product => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={getImageSrc(product.image, 'https://via.placeholder.com/300?text=Product')}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300?text=Product';
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                    <Button size="sm" variant="outline">
                      <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products available</p>
        )}
      </div>

      {/* Services Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Services</h2>
        {hub.services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hub.services.map(service => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={getImageSrc(service.image, 'https://via.placeholder.com/300?text=Service')}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300?text=Service';
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">${service.price.toFixed(2)}</span>
                    <Button size="sm">Book Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No services available</p>
        )}
      </div>

      {/* Social Links */}
      {hub.socials.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Connect With Us</h2>
          <div className="flex gap-4">
            {hub.socials.map(social => (
              <a 
                key={social.id} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {social.platform}: {social.handle}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HubPage;