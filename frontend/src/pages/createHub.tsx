import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/components/ui/card";
import { Input } from "@/components/components/ui/input";
import { Label } from "@/components/components/ui/label";
import { Textarea } from "@/components/components/ui/textarea";
import { Button } from "@/components/components/ui/button";
import { 
  CheckCircle2, 
  Store, 
  MapPin, 
  FileImage, 
  ImageIcon, 
  ArrowRight, 
  ArrowLeft, 
  Loader2 
} from "lucide-react";
import 'react-toastify/dist/ReactToastify.css';
import { toast as toastNotify } from "react-toastify";

const HubRegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    logo: null as File | null,
    coverImage: null as File | null
  });
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(files[0]);
      if (name === "logo") {
        setLogoPreview(previewUrl);
      } else if (name === "coverImage") {
        setCoverPreview(previewUrl);
      }
    }
  };

  const nextStep = () => {
    // Validate current step
    if (step === 1 && !formData.name.trim()) {
      toastNotify("Hub name required", {
        type: "error",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    
    if (step === 2 && !formData.description.trim()) {
      toastNotify("Description required", {
        type: "error",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    
    if (step === 3 && !formData.location.trim()) {
      toastNotify("Location required", {
        type: "error",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
  
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("location", formData.location);
      if (formData.logo) formDataToSend.append("logo", formData.logo);
      if (formData.coverImage) formDataToSend.append("coverImage", formData.coverImage);
  
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const response = await fetch("https://0981-154-159-237-144.ngrok-free.app/api/hub/create-hub", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formDataToSend,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register hub");
      }
  
      const result = await response.json();
  
      toastNotify("Success! Your beauty hub has been created successfully!", {
        type: "success",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      setStep(6);
    } catch (error) {
      let errorMessage = "An unexpected error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toastNotify(errorMessage, {
        type: "error",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Variants for animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className="flex flex-col items-center mx-2">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                num < step ? "bg-pink-600 text-white" : 
                num === step ? "bg-pink-500 text-white border-2 border-pink-300" : 
                "bg-gray-200 text-gray-600"
              }`}
            >
              {num < step ? <CheckCircle2 size={16} /> : num}
            </div>
            <div className="text-xs text-gray-500 mt-1 hidden sm:block">
              {num === 1 ? "Name" : 
               num === 2 ? "Description" : 
               num === 3 ? "Location" : 
               num === 4 ? "Logo" : "Cover"}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="text-center text-2xl">Create Your Beauty Hub</CardTitle>
          <CardDescription className="text-center text-white/80">
            Let's set up your personalized vendor space
          </CardDescription>
        </CardHeader>
        
        {step <= 5 && renderStepIndicator()}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <CardContent className="pt-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <Store className="h-12 w-12 text-pink-500" />
                  </div>
                  <h3 className="text-center text-lg font-medium">What's your beauty hub name?</h3>
                  <p className="text-center text-gray-500 text-sm mb-4">
                    This is what clients will see when they visit your profile
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="name">Hub Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. Bella Beauty Studio"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="focus-visible:ring-pink-500"
                    />
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-center text-lg font-medium">Describe your beauty hub</h3>
                  <p className="text-center text-gray-500 text-sm mb-4">
                    Tell potential clients what makes your services special
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="We specialize in modern hair styling and makeup for all occasions..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="h-32 focus-visible:ring-pink-500"
                    />
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <MapPin className="h-12 w-12 text-pink-500" />
                  </div>
                  <h3 className="text-center text-lg font-medium">Where are you located?</h3>
                  <p className="text-center text-gray-500 text-sm mb-4">
                    Help local clients find your beauty services
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g. Lagos, Nigeria"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="focus-visible:ring-pink-500"
                    />
                  </div>
                </div>
              )}
              
              {step === 4 && (
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <FileImage className="h-12 w-12 text-pink-500" />
                  </div>
                  <h3 className="text-center text-lg font-medium">Upload your logo</h3>
                  <p className="text-center text-gray-500 text-sm mb-4">
                    This will help clients recognize your brand
                  </p>
                  
                  {logoPreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-32 h-32 overflow-hidden rounded-full border-2 border-pink-200">
                        <img 
                          src={logoPreview} 
                          alt="Logo Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setLogoPreview(null);
                          setFormData({...formData, logo: null});
                        }}
                      >
                        Change Logo
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <Label 
                        htmlFor="logo" 
                        className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-full bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileImage className="w-10 h-10 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500">Click to upload</p>
                        </div>
                        <Input 
                          id="logo" 
                          name="logo" 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </Label>
                    </div>
                  )}
                </div>
              )}
              
              {step === 5 && (
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <ImageIcon className="h-12 w-12 text-pink-500" />
                  </div>
                  <h3 className="text-center text-lg font-medium">Add a cover image</h3>
                  <p className="text-center text-gray-500 text-sm mb-4">
                    Showcase your beauty work with an eye-catching cover
                  </p>
                  
                  {coverPreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-full h-40 overflow-hidden rounded-lg border-2 border-pink-200">
                        <img 
                          src={coverPreview} 
                          alt="Cover Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setCoverPreview(null);
                          setFormData({...formData, coverImage: null});
                        }}
                      >
                        Change Cover
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <Label 
                        htmlFor="coverImage" 
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500">Click to upload a cover image</p>
                        </div>
                        <Input 
                          id="coverImage" 
                          name="coverImage" 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </Label>
                    </div>
                  )}
                </div>
              )}
              
              {step === 6 && (
                <div className="flex flex-col items-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-center">
                    Congratulations!
                  </h3>
                  <p className="text-gray-500 text-center mt-2 mb-6">
                    Your beauty hub has been created successfully. You can now start adding your products and services.
                  </p>
                  <Button 
                    className="bg-pink-600 hover:bg-pink-700 text-white"
                    onClick={() => window.location.href = "/dashboard"}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              )}
            </CardContent>
          </motion.div>
        </AnimatePresence>
        
        {step < 6 && (
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button 
                variant="outline" 
                onClick={prevStep} 
                disabled={isSubmitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : (
              <div></div>
            )}
            
            {step < 5 ? (
              <Button 
                onClick={nextStep} 
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                className="bg-pink-600 hover:bg-pink-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    Create Hub
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default HubRegistrationForm;