import React, { useState, useEffect } from "react";
import { Button } from "@/components/components/ui/button";
import { MoonIcon, SunIcon, BellIcon, MenuIcon, LogOut, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/components/ui/avatar";
import { Input } from "@/components/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/components/ui/sheet";

interface GreetingHeaderProps {
  onSignOut: () => void;
}

const GreetingHeader: React.FC<GreetingHeaderProps> = ({ onSignOut }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) return;

        const response = await fetch("https://0981-154-159-237-144.ngrok-free.app/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const user = await response.json();
        if (user && user.firstName) {
          setUserName(user.firstName);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  // Get current time of day for greeting
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  if (hour >= 17) greeting = "Good evening";
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 lg:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Dashboard Menu</SheetTitle>
                <SheetDescription>Navigate through your hub dashboard</SheetDescription>
              </SheetHeader>
              <nav className="grid gap-2 py-6">
                <Button variant="ghost" className="justify-start">Dashboard</Button>
                <Button variant="ghost" className="justify-start">Services</Button>
                <Button variant="ghost" className="justify-start">Products</Button>
                <Button variant="ghost" className="justify-start">Analytics</Button>
                <Button variant="ghost" className="justify-start">Settings</Button>
              </nav>
            </SheetContent>
          </Sheet>
          
          <div className="hidden md:block font-bold text-xl">Hub Dashboard</div>
          
          <div className="relative hidden md:block max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search hub..."
              className="pl-8 w-[200px] lg:w-[300px] bg-background"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-sm">
            <span className="text-muted-foreground">{greeting},</span>{" "}
            <span className="font-medium">{userName}</span>
          </div>
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? (
              <MoonIcon className="h-5 w-5" />
            ) : (
              <SunIcon className="h-5 w-5" />
            )}
          </Button>
          
          <Button variant="ghost" size="icon">
            <BellIcon className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default GreetingHeader;
