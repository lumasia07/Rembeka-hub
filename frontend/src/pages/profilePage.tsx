import React from "react";
import GreetingHeader from "@/components/components/greeting";

const ProfilePage: React.FC = () => {
  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <GreetingHeader onSignOut={handleSignOut} />
    </div>
  );
};

export default ProfilePage;
