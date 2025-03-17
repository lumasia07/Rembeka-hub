import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/components/ui/avatar";
import { Button } from "@/components/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/components/ui/popover";
import { LogOut, Smile, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";


export interface GreetingHeaderProps {
  onSignOut: () => void;
  onCreateHub?: () => void;
}

const GreetingHeader: React.FC<GreetingHeaderProps> = ({ onSignOut, onCreateHub }) => {
  const [greeting, setGreeting] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch("https://0981-154-159-237-144.ngrok-free.app/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setFirstName(data.firstName);
        setLastName(data.lastName);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-4 sm:mb-8 gap-4">
        <motion.div
          className="text-center sm:text-left"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1">
            {greeting}, <span className="text-pink-600">{firstName} {lastName}</span>!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Welcome to your beauty vendor dashboard</p>
        </motion.div>

        <Popover>
          <PopoverTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Button variant="ghost" className="p-1 shadow rounded-full">
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 shadow-md shadow-gray-400">
                  <AvatarFallback className="bg-pink-600 text-white">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </motion.div>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-44 p-2 bg-white shadow-lg rounded-xl border border-gray-200">
            <Button
              variant="ghost"
              onClick={onSignOut}
              className="w-full flex items-center justify-start gap-2 text-red-500 transition-colors hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      {/* Divider */}
      <motion.div 
        className="w-full h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent mb-6"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      ></motion.div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          className="max-w-md mx-auto text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Time to showcase your beauty brand!</h2>
          <p className="text-gray-600 mb-6">Create your personalized hub to manage products, services, and connect with potential clients.</p>
        </motion.div>

        {/* Animated Icon */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Smile className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-pink-500 drop-shadow-lg" />
          </motion.div>
        </motion.div>

        {/* Create Hub Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => navigate('/create-hub')}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-6 rounded-xl shadow-lg flex items-center gap-2 text-lg"
          >
            <PlusCircle className="w-5 h-5" />
            Create Your Hub
          </Button>
        </motion.div>

        {/* Benefits Section */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="font-bold text-gray-800 mb-2">Showcase Products</h3>
            <p className="text-sm text-gray-600">Display your beauty products with stunning visuals.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="font-bold text-gray-800 mb-2">List Services</h3>
            <p className="text-sm text-gray-600">Share your services with pricing and availability.</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h3 className="font-bold text-gray-800 mb-2">Connect Socials</h3>
            <p className="text-sm text-gray-600">Link your social media accounts to grow your audience.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GreetingHeader;