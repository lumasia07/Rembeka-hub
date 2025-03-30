import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addSocial = async (req, res) => {
  try {
    const { platform, handle, url } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const hub = await prisma.hub.findUnique({
      where: { userId }
    });

    if (!hub) {
      return res.status(404).json({ error: "Hub not found" });
    }

    // Validate platform
    const validPlatforms = ["Instagram", "TikTok", "Facebook", "Twitter", "YouTube", "Whatsapp"];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ error: "Invalid social platform" });
    }

    const newSocial = await prisma.social.create({
      data: {
        platform,
        handle,
        url,
        hubId: hub.id
      }
    });

    res.status(201).json(newSocial);
  } catch (error) {
    console.error("Error adding social:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getSocials = async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    const hub = await prisma.hub.findUnique({
      where: { userId },
      include: { socials: true }
    });

    if (!hub) {
      return res.status(404).json({ error: "Hub not found" });
    }

    res.status(200).json(hub.socials);
  } catch (error) {
    console.error("Error fetching socials:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateSocial = async (req, res) => {
  try {
    const { id } = req.params;
    const { platform, handle, url } = req.body;

    const updatedSocial = await prisma.social.update({
      where: { id },
      data: { platform, handle, url }
    });

    res.status(200).json(updatedSocial);
  } catch (error) {
    console.error("Error updating social:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteSocial = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.social.delete({
      where: { id }
    });

    res.status(200).json({ message: "Social link deleted" });
  } catch (error) {
    console.error("Error deleting social:", error);
    res.status(500).json({ error: "Server error" });
  }
};