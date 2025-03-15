import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/components/ui/avatar";
import { Button } from "@/components/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/components/ui/popover";
import { LogOut, Smile } from "lucide-react";
import { motion } from "framer-motion";

export interface GreetingHeaderProps {
  onSignOut: () => void;
}

const GreetingHeader: React.FC<GreetingHeaderProps> = ({ onSignOut }) => {
  const [greeting, setGreeting] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await fetch("http://localhost:3000/api/user/profile", {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col justify-between p-8">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-8">
        <motion.h1
          className="text-4xl font-bold text-gray-800"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {greeting}, {firstName} {lastName}!
        </motion.h1>

        <Popover>
          <PopoverTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Button variant="ghost" className="p-1 shadow-lg rounded-full">
                <Avatar className="w-12 h-12 shadow-md shadow-gray-400">
                  <AvatarFallback>{initials}</AvatarFallback>
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
      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mb-6"></div>

      {/* Coming Soon Section */}
      <motion.div
        className="flex flex-col items-center justify-center flex-grow"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
        >
          <Smile className="w-32 h-32 text-pink-500 mb-4 drop-shadow-lg" />
        </motion.div>

        <h2 className="text-3xl font-bold text-pink-500 drop-shadow-md">
          Rembeka Hub is Coming Soon
        </h2>
      </motion.div>
    </div>
  );
};

export default GreetingHeader;
