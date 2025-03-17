import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserHub(req, res) {
  try {

    const userId = req.user?.userId;
    // Check if the user has a hub
    const hub = await prisma.hub.findUnique({
      where: {
        userId: userId,
      },
    });

    return res.status(200).json({ hub });
  } catch (error) {
    console.error("Error fetching user hub:", error);
    return res.status(500).json({ error: "Failed to fetch user hub" });
  }
}

