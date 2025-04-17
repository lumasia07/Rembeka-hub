import React, { useEffect, useState } from "react";
import { Button } from "@/components/components/ui/button";
import { useNavigate } from "react-router-dom";

interface GreetingHeaderProps {
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
        if (!token) return;

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFirstName(data.firstName);
          setLastName(data.lastName);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {greeting}, {firstName} {lastName}
          </h1>
          <p className="text-gray-600">Welcome to your vendor dashboard</p>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={onSignOut}
            className="text-gray-700"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Create Your Business Hub
        </h2>
        <p className="text-gray-600 mb-8">
          Set up your space to showcase products and services
        </p>
        <Button 
          onClick={() => navigate('/create-hub')}
          className="bg-pink-600 hover:bg-pink-700 px-6 py-3"
        >
          Get Started
        </Button>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto">
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-bold mb-2">Products</h3>
          <p className="text-sm text-gray-600">Showcase your beauty products</p>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-bold mb-2">Services</h3>
          <p className="text-sm text-gray-600">List your beauty services</p>
        </div>
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="font-bold mb-2">Connect</h3>
          <p className="text-sm text-gray-600">Link your social media</p>
        </div>
      </div>
    </div>
  );
};

export default GreetingHeader;