import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, AwardIcon, TrendingUpIcon, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  }[];
  services: {
    id: string;
  }[];
  user: {
    firstName: string;
    lastName: string;
  };
}

export const VendorShowcase = () => {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const getImageSrc = (image: string | null, fallback: string) => {
    if (!image) return fallback;
    if (image.startsWith('http')) return image;
    if (image.startsWith('data:image')) return image;
    return `data:image/jpeg;base64,${image}`;
  };

  useEffect(() => {
    const fetchHubs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hub/hubs`);
        if (!response.ok) {
          throw new Error('Failed to fetch hubs');
        }
        const data = await response.json();
        setHubs(data.hubs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHubs();
  }, []);

  const handleViewStore = (hubId: string) => {
    navigate(`/hubs/${hubId}`);
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-5xl"> {/* Reduced width container */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Top Beauty Vendors</h2>
          <p className="text-gray-500">Discover premium beauty brands in the industry</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hubs.map(hub => (
            <motion.div
              key={hub.id}
              className="bg-gray-50 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              whileHover={{ scale: 1.02 }}
            >
              <div className="h-40 relative overflow-hidden"> {/* Reduced height */}
                <img
                  src={getImageSrc(hub.coverImage, 'https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80')}
                  alt={hub.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
                  }}
                />
                <div className="absolute top-3 right-3 flex gap-2">
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
              </div>
              <div className="p-4">
                <p className="text-sm text-pink-600 mb-1">{hub.user.firstName} {hub.user.lastName}</p>
                <h3 className="text-lg font-semibold mb-2">{hub.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex flex-col text-sm text-gray-600">
                    <div className="flex items-center">
                      <AwardIcon className="w-4 h-4 mr-1" />
                      {hub.products.length} Products
                    </div>
                    <div className="flex items-center mt-1">
                      <AwardIcon className="w-4 h-4 mr-1" />
                      {hub.services.length} Services
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewStore(hub.id)}
                    className="bg-pink-500 text-white px-4 py-1 rounded hover:bg-pink-600 transition"
                  >
                    View Store
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};