import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserHub(req, res) {
  try {
    const userId = req.user?.userId;

    // Check if the user has a hub and fetch related details
    const hub = await prisma.hub.findUnique({
      where: {
        userId: userId,
      },
      include: {
        user: true, // Include user details
        services: true, // Include services associated with the hub
        products: true, // Include products associated with the hub
      },
    });

    if (!hub) {
      return res.status(404).json({ error: "Hub not found" });
    }

    return res.status(200).json({ hub });
  } catch (error) {
    console.error("Error fetching user hub:", error);
    return res.status(500).json({ error: "Failed to fetch user hub" });
  }
}