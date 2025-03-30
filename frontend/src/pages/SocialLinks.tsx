import { useEffect, useState } from "react";
import { Button } from "@/components/components/ui/button";
import { Input } from "@/components/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/components/ui/select";
import { Trash2, Pencil, Plus } from "lucide-react";

interface SocialLink {
  id: string;
  platform: string;
  handle: string;
  url: string;
}

export const SocialLinks = () => {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ platform: "", handle: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSocials();
  }, []);

  const fetchSocials = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/socials/all-socials", {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}` 
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch social links");
      }
      
      const data = await response.json();
      setSocials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const socialUrl = `${formData.platform.toLowerCase()}.com/${formData.handle}`;
      const endpoint = editingId 
        ? `http://localhost:3000/api/socials/edit-social/${editingId}`
        : "http://localhost:3000/api/socials/add-socials";
      
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify({ 
          ...formData, 
          url: socialUrl 
        })
      });

      if (!response.ok) {
        throw new Error(editingId ? "Failed to update" : "Failed to create");
      }

      fetchSocials();
      setEditingId(null);
      setFormData({ platform: "", handle: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/socials/delete-social/${id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}` 
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      fetchSocials();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Select
          value={formData.platform}
          onValueChange={(value) => setFormData({ ...formData, platform: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="TikTok">TikTok</SelectItem>
            <SelectItem value="Facebook">Facebook</SelectItem>
            <SelectItem value="Twitter">Twitter</SelectItem>
            <SelectItem value="YouTube">YouTube</SelectItem>
          </SelectContent>
        </Select>
        
        <Input
          placeholder="Username"
          value={formData.handle}
          onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
          required
        />
        
        <Button type="submit" disabled={loading}>
          {editingId ? <Pencil size={16} /> : <Plus size={16} />}
        </Button>
      </form>

      <div className="space-y-2">
        {socials.map((social) => (
          <div key={social.id} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center gap-4">
              <span className="font-medium">{social.platform}</span>
              <a 
                href={`https://${social.url}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                @{social.handle}
              </a>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingId(social.id);
                  setFormData({
                    platform: social.platform,
                    handle: social.handle
                  });
                }}
                disabled={loading}
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(social.id)}
                disabled={loading}
              >
                <Trash2 size={16} className="text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};