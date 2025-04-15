import { Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cn } from "@/components/lib/utils";
import { Button } from "@/components/components/ui/button";
import { Card, CardContent } from "@/components/components/ui/card";
import { Input } from "@/components/components/ui/input";
import { Label } from "@/components/components/ui/label";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify({
          email: data.user.email,
          role: data.user.role,
          id: data.user.id,
        }));

        toast.success("Logged in successfully!");
        
        const hubResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/hub/user/${data.user.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        });

        if (hubResponse.ok) {
          const hubData = await hubResponse.json();
          navigate(hubData.hub ? '/dashboard' : '/profile');
        } else {
          toast.error("Failed to check hub status");
        }
      } else {
        toast.error(data.message || "Failed to login");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 max-w-md mx-auto", className)} {...props}>
      <ToastContainer position="top-center" autoClose={3000} />
      <Card className="w-full">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold">Login</h1>
              <p className="text-sm text-gray-500">
                Enter your credentials to continue
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="janedoe@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a 
                  href="#" 
                  className="text-sm text-pink-600 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
              Login
            </Button>

            <div className="text-center text-sm">
              Don't have an account?{' '}
              <a href="/register" className="text-pink-600 hover:underline">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="text-xs text-gray-500 text-center">
        By logging in, you agree to our Terms and Privacy Policy
      </p>
    </div>
  );
}