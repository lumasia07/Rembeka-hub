import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, AwardIcon, TrendingUpIcon, Loader2, SearchIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/components/ui/input";
import { Button } from "@/components/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/components/ui/select";

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
  user: {
    firstName: string;
    lastName: string;
  };
  socials?: {
    id: string;
    platform: string;
    handle: string;
    url: string;
  }[];
}

const AllVendorShowcase = () => {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [filteredHubs, setFilteredHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [verifiedFilter, setVerifiedFilter] = useState('all');
  const [trendingFilter, setTrendingFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHubs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hub/hubs`);
        if (!response.ok) {
          throw new Error('Failed to fetch hubs');
        }
        const data = await response.json();
        setHubs(data.hubs);
        setFilteredHubs(data.hubs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHubs();
  }, []);

  useEffect(() => {
    let results = [...hubs];

    // Apply search filter
    if (searchTerm) {
      results = results.filter(hub =>
        hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hub.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${hub.user.firstName} ${hub.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply verified filter
    if (verifiedFilter !== 'all') {
      const isVerified = verifiedFilter === 'verified';
      results = results.filter(hub => hub.verified === isVerified);
    }

    // Apply trending filter
    if (trendingFilter !== 'all') {
      const isTrending = trendingFilter === 'trending';
      results = results.filter(hub => hub.trending === isTrending);
    }

    // Apply sorting
    results.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'products':
          return b.products.length - a.products.length;
        case 'trending':
          return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredHubs(results);
  }, [hubs, searchTerm, sortBy, verifiedFilter, trendingFilter]);

  const handleViewStore = (hubId: string) => {
    navigate(`/hubs/${hubId}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('name');
    setVerifiedFilter('all');
    setTrendingFilter('all');
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Top Beauty Vendors
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-600 max-w-2xl"
            >
              Discover premium beauty brands that are making waves in the industry
            </motion.p>
          </div>
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-pink-600 font-medium flex items-center mt-4 md:mt-0"
          >
            View all vendors
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2"
            >
              <path
                d="M4.16663 10H15.8333"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.8334 5L15.8334 10L10.8334 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
        </div>

        {/* Search and Filters Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search vendors..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="products">Product Count</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Verified" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="unverified">Unverified Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={trendingFilter} onValueChange={setTrendingFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Trending" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="trending">Trending Only</SelectItem>
              <SelectItem value="not-trending">Not Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {(searchTerm || sortBy !== 'name' || verifiedFilter !== 'all' || trendingFilter !== 'all') && (
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 text-sm text-gray-500">
          Showing {filteredHubs.length} of {hubs.length} vendors
        </div>

        {/* Vendors Grid */}
        {filteredHubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredHubs.map((hub, index) => (
              <motion.div
                key={hub.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={hub.coverImage || 'https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'}
                    alt={hub.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{hub.name}</h3>
                    <div className="flex items-center">
                      {hub.verified && (
                        <div className="mr-2 text-blue-600 bg-blue-100 p-1 rounded-full" title="Verified Vendor">
                          <ShieldCheckIcon size={16} />
                        </div>
                      )}
                      {hub.trending && (
                        <div className="text-orange-600 bg-orange-100 p-1 rounded-full" title="Trending">
                          <TrendingUpIcon size={16} />
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{hub.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AwardIcon size={16} className="text-pink-500 mr-1" />
                      <span className="text-sm text-gray-600">
                        {hub.products.length} Products
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-md text-sm"
                      onClick={() => handleViewStore(hub.id)}
                    >
                      View Store
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No vendors found matching your criteria</p>
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllVendorShowcase;