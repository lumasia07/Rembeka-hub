import { PrismaClient } from "@prisma/client";
import multer from "multer";

const prisma = new PrismaClient();

// Configure multer for file uploads
const upload = multer();

// Use multer middleware to parse multipart/form-data
export const config = {
  api: {
    bodyParser: false, // Disable default bodyParser
  },
};

export async function registerHub(req, res) {
  try {
    // Use multer to parse the request
    upload.any()(req, res, async (err) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(400).json({ error: "Failed to parse form data" });
      }

      // Extract fields and files from the request
      const { name, description, location } = req.body;
      const logoFile = req.files.find((file) => file.fieldname === "logo");
      const coverImageFile = req.files.find((file) => file.fieldname === "coverImage");

      const userId = req.user?.userId;

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if user already has a hub
      const existingHub = await prisma.hub.findUnique({
        where: {
          userId: userId,
        },
      });

      if (existingHub) {
        return res.status(400).json({ error: "User already has a hub registered" });
      }

      // Create new hub
      const hub = await prisma.hub.create({
        data: {
          name,
          description,
          location,
          logo: logoFile ? logoFile.buffer.toString("base64") : null, // Store as base64
          coverImage: coverImageFile ? coverImageFile.buffer.toString("base64") : null,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return res.status(201).json({
        message: "Hub registered successfully",
        hub,
      });
    });
  } catch (error) {
    console.error("Error registering hub:", error);
    return res.status(500).json({ error: "Failed to register hub" });
  }
}