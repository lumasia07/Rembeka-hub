import { useState } from "react";
import { Button } from "@/components/components/ui/button";
import { Input } from "@/components/components/ui/input";
import { Textarea } from "@/components/components/ui/textarea";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const validateStep = () => {
    if (step === 1 && !formData.name.trim()) {
      toast.error("Hub name is required");
      return false;
    }
    if (step === 2 && !formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (step === 3 && !formData.location.trim()) {
      toast.error("Location is required");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hub/create-hub`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Failed to register hub");
      
      toast.success("Hub created successfully!");
      setStep(6);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Create Your Business</h1>
        
        <div className="flex justify-center mb-8">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className={`mx-2 w-10 h-10 rounded-full flex items-center justify-center 
              ${num < step ? "bg-green-500 text-white" : 
                num === step ? "bg-pink-500 text-white" : 
                "bg-gray-200"}`}>
              {num}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-lg mb-2">Business Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your business name"
                className="h-14 text-lg"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-lg mb-2">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your business"
                className="h-32 text-lg"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-lg mb-2">Location</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Nakuru"
                className="h-14 text-lg"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <label className="block text-lg mb-2">Upload Logo</label>
              <Input
                type="file"
                name="logo"
                onChange={handleFileChange}
                className="h-14 text-lg"
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div>
              <label className="block text-lg mb-2">Upload Cover Image</label>
              <Input
                type="file"
                name="coverImage"
                onChange={handleFileChange}
                className="h-14 text-lg"
              />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold mb-4">Success!</h2>
            <p className="text-lg mb-6">Your business has been registered</p>
            <Button 
              onClick={() => window.location.href = "/dashboard"}
              className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 text-lg"
            >
              Go to Dashboard
            </Button>
          </div>
        )}

        {step < 6 && (
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button 
                onClick={prevStep} 
                className="px-8 py-4 text-lg"
                variant="outline"
              >
                Back
              </Button>
            )}
            <div className="flex-grow"></div>
            {step < 5 ? (
              <Button 
                onClick={nextStep} 
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 text-lg"
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Business"}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HubRegistrationForm;