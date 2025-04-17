import { PrismaClient } from "@prisma/client";
import multer from "multer";

const prisma = new PrismaClient();
const imgUpload = multer({ storage: multer.memoryStorage() });

export const config = {
    api: {
        bodyParser: false,
    }
};

// Add Service
export async function addService(req, res) {
    try {
        imgUpload.any()(req, res, async (err) => {
            if (err) {
                console.error("Error parsing form data:", err);
                return res.status(400).json({ error: "Failed to parse form data" });
            }

            const { name, description, price, duration, isAvailable } = req.body;
            const imageFile = req.files?.find((file) => file.fieldname === "image");

            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized: User ID is missing" });
            }

            if (!name || !price) {
                return res.status(400).json({ error: "Name and price are required!" });
            }

            // Find the user's hub
            const userHub = await prisma.hub.findUnique({
                where: { userId }
            });

            if (!userHub) {
                return res.status(404).json({ error: "Hub not found for this user" });
            }

            // Check if the service already exists within the user's hub
            const existingService = await prisma.service.findFirst({
                where: {
                    name,
                    hubId: userHub.id // Ensure service belongs to the correct hub
                }
            });

            if (existingService) {
                return res.status(400).json({ error: "Oops! Service already exists in your hub!" });
            }

            // Create new service
            const newService = await prisma.service.create({
                data: {
                    name,
                    description,
                    price: parseFloat(price), // Ensure price is stored as a number
                    duration: duration ? parseInt(duration) : null,
                    image: imageFile ? imageFile.buffer.toString("base64") : null,
                    isAvailable: isAvailable === "true", // Convert string to boolean
                    hubId: userHub.id // Link service to the user's hub
                }
            });

            return res.status(201).json({
                message: "Service added successfully",
                service: newService
            });
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: "Server error. Please try again!" });
    }
}

// Get All Services
export async function getAllServices(req, res) {
    try {
        const services = await prisma.service.findMany();
        return res.status(200).json(services);
    } catch (error) {
        console.error("Error fetching services:", error);
        return res.status(500).json({ error: "Server error. Please try again!" });
    }
}

// Get Service by ID
export async function getServiceById(req, res) {
    const { id } = req.params;

    try {
        const service = await prisma.service.findUnique({
            where: { id }
        });

        if (!service) {
            return res.status(404).json({ error: "Service not found" });
        }

        return res.status(200).json(service);
    } catch (error) {
        console.error("Error fetching service:", error);
        return res.status(500).json({ error: "Server error. Please try again!" });
    }
}

// Edit Service
export async function updateService(req, res) {
    const { id } = req.params;
    const { name, description, price, duration, isAvailable } = req.body;

    try {
        const existingService = await prisma.service.findUnique({
            where: { id }
        });

        if (!existingService) {
            return res.status(404).json({ error: "Service not found" });
        }

        const updatedService = await prisma.service.update({
            where: { id },
            data: {
                name,
                description,
                price: parseFloat(price),
                duration: duration ? parseInt(duration) : null,
                isAvailable: isAvailable === "true"
            }
        });

        return res.status(200).json({
            message: "Service updated successfully",
            service: updatedService
        });
    } catch (error) {
        console.error("Error updating service:", error);
        return res.status(500).json({ error: "Server error. Please try again!" });
    }
}

// Delete Service
export async function deleteService(req, res) {
    const { id } = req.params;

    try {
        const existingService = await prisma.service.findUnique({
            where: { id }
        });

        if (!existingService) {
            return res.status(404).json({ error: "Service not found" });
        }

        await prisma.service.delete({
            where: { id }
        });

        return res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error("Error deleting service:", error);
        return res.status(500).json({ error: "Server error. Please try again!" });
    }
}

// Get Services for Authenticated User
export async function getServicesByOwner(req, res) {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User ID is missing" });
        }

        const userHub = await prisma.hub.findUnique({
            where: { userId }
        });

        if (!userHub) {
            return res.status(404).json({ error: "Hub not found for this user" });
        }

        const services = await prisma.service.findMany({
            where: { hubId: userHub.id }
        });

        return res.status(200).json(services);
    } catch (error) {
        console.error("Error fetching user's services:", error);
        return res.status(500).json({ error: "Server error. Please try again!" });
    }
}
