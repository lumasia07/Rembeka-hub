import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all hubs (simple version without pagination)
export async function getAllHubs(req, res) {
  try {
    const hubs = await prisma.hub.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        products: {
          take: 3, // Only get first 3 products per hub
          orderBy: {
            createdAt: 'desc'
          }
        },
        services: {
          take: 3, // Only get first 3 services per hub
          orderBy: {
            createdAt: 'desc'
          }
        },
        socials: true
      },
      orderBy: {
        createdAt: 'desc' // Newest hubs first
      }
    });

    return res.status(200).json({ hubs });
  } catch (error) {
    console.error("Error fetching all hubs:", error);
    return res.status(500).json({ error: "Failed to fetch hubs" });
  }
}

// Get a specific user's hub
export async function getUserHub(req, res) {
  try {
    const userId = req.params.userId;

    const hub = await prisma.hub.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phoneNo: true,
          }
        },
        products: true,
        services: true,
        socials: true,
      },
    });

    if (!hub) {
      return res.status(200).json({ hub: null }); // still a success, just no hub yet
    }

    return res.status(200).json({ hub });

  } catch (error) {
    console.error('Error fetching user hub:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get Hub By ID
export async function getHubById(req, res) {
  try {
    const { id } = req.params;
    
    const hub = await prisma.hub.findUnique({
      where: {
        id: id,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phoneNo: true
          }
        },
        products: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        services: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        socials: true
      }
    });

    if (!hub) {
      return res.status(404).json({ error: "Hub not found" });
    }

    return res.status(200).json({ hub });
  } catch (error) {
    console.error("Error fetching hub by ID:", error);
    return res.status(500).json({ error: "Failed to fetch hub" });
  }
}