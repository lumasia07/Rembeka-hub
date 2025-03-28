import { PrismaClient } from "@prisma/client";
import multer from "multer";

const prisma = new PrismaClient();
const imgUpload = multer({ storage: multer.memoryStorage() });

export const config = {
    api: {
        bodyParser: false,
    }
};

// Add Product
export async function addProduct(req, res) {
    try {
        imgUpload.any()(req, res, async (err) => {
            if (err) {
                console.error("Error parsing form data:", err);
                return res.status(400).json({ error: "Failed to parse form data" });
            }

            const { name, description, price, inStock } = req.body;
            const imageFile = req.files?.find((file) => file.fieldname === "image");

            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Unauthorized: User ID is missing" });
            }

            if (!name || !description || !price || !inStock) {
                return res.status(400).json({ error: "All fields are required!" });
            }

            // Find the user's hub
            const userHub = await prisma.hub.findUnique({
                where: { userId }
            });

            if (!userHub) {
                return res.status(404).json({ error: "Hub not found for this user" });
            }

            // Check if the product already exists within the user's hub
            const existingProduct = await prisma.product.findFirst({
                where: {
                    name,
                    hubId: userHub.id // Ensure product belongs to the correct hub
                }
            });

            if (existingProduct) {
                return res.status(400).json({ error: "Oops! Product already exists in your hub!" });
            }

            // Create new product
            const newProduct = await prisma.product.create({
                data: {
                    name,
                    description,
                    price: parseFloat(price), // Ensure price is stored as a number
                    image: imageFile ? imageFile.buffer.toString("base64") : null,
                    inStock: inStock === "true", // Convert string to boolean
                    hubId: userHub.id // Link product to the user's hub
                }
            });

            return res.status(201).json({
                message: "Product added successfully",
                product: newProduct
            });
        });
    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: "Server error. Please try again!" });
    }
}

// Get All Products
export async function getAllProducts(req, res) {
    try {
        const products = await prisma.product.findMany();
        return res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ error: "Server error. Please try again!" });
    }
}

// Get Product by ID
export async function getProductById(req, res) {
    const { id } = req.params;

    try {
        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        return res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ error: "Server error. Please try again!" });
    }
}

// Edit Product
export async function updateProduct(req, res) {
    const { id } = req.params;
    const { name, description, price, inStock } = req.body;

    try {
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });

        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price: parseFloat(price),
                inStock: inStock === "true"
            }
        });

        return res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ error: "Server error. Please try again!" });
    }
}

// Delete Product
export async function deleteProduct(req, res) {
    const { id } = req.params;

    try {
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });

        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        await prisma.product.delete({
            where: { id }
        });

        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ error: "Server error. Please try again!" });
    }
}
