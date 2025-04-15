import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ImageIcon, ClockIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/components/ui/dialog";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaTiktok
} from 'react-icons/fa';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number;
  image?: string;
  isAvailable: boolean;
  hub?: {
    id: string;
    name: string;
    socials?: Social[];
  };
  hubId?: string;
  rating?: number;
}

interface Social {
  id: string;
  platform: string;
  handle: string;
  url: string;
  hubId: string;
}

export const FeaturedServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socials, setSocials] = useState<Social[]>([]);
  const [loadingSocials, setLoadingSocials] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/service/all-services`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const data = await response.json();
        setServices(data.filter((s: Service) => s.isAvailable).slice(0, 4));
      } catch (err) {
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleBookNow = async (service: Service) => {
    setSelectedService(service);
    setIsSocialModalOpen(true);

    const hubId = service.hub?.id || service.hubId;
    if (!hubId) return;

    try {
      if (service.hub?.socials?.length) {
        setSocials(service.hub.socials);
        return;
      }

      setLoadingSocials(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/socials/hub-socials/${hubId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      setSocials(data);
    } catch {
      setSocials([]);
    } finally {
      setLoadingSocials(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const base = "w-6 h-6";
    switch (platform.toLowerCase()) {
      case 'instagram': return <FaInstagram className={`${base} text-pink-600`} />;
      case 'facebook': return <FaFacebook className={`${base} text-blue-600`} />;
      case 'twitter': return <FaTwitter className={`${base} text-sky-500`} />;
      case 'youtube': return <FaYoutube className={`${base} text-red-600`} />;
      case 'tiktok': return <FaTiktok className={`${base} text-black`} />;
      default: return <div className={base} />;
    }
  };

  const renderServiceImage = (service: Service) => {
    if (!service.image) {
      return (
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-300" />
        </div>
      );
    }

    const imageSrc = service.image.startsWith('http') || service.image.startsWith('data:image')
      ? service.image
      : `data:image/jpeg;base64,${service.image}`;

    return <img src={imageSrc} alt={service.name} className="h-48 w-full object-cover" />;
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
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Popular Beauty Services</h2>
          <p className="text-gray-500">Discover top beauty services from our professionals</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(service => (
            <motion.div
              key={service.id}
              className="bg-gray-50 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
              whileHover={{ scale: 1.02 }}
            >
              {renderServiceImage(service)}
              <div className="p-4">
                <p className="text-sm text-pink-600 mb-1">{service.hub?.name || 'Professional'}</p>
                <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                {service.duration && (
                  <p className="text-sm text-gray-500 mb-2 flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {service.duration} mins
                  </p>
                )}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-gray-800"> KES {service.price.toFixed(2)}</span>
                  <button
                    onClick={() => handleBookNow(service)}
                    className={`px-4 py-1 rounded transition ${
                      service.isAvailable 
                        ? 'bg-pink-500 text-white hover:bg-pink-600'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={!service.isAvailable}
                  >
                    {service.isAvailable ? 'Book Now' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={isSocialModalOpen} onOpenChange={setIsSocialModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find {selectedService?.hub?.name || 'professional'} online</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-4 mt-4">
            {loadingSocials ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            ) : socials.length > 0 ? (
              socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:underline"
                >
                  {getPlatformIcon(social.platform)}
                  @{social.handle}
                </a>
              ))
            ) : (
              <p className="text-gray-500">No social links found.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};