import { Router } from "express";
import { addProduct, getAllProducts, getProductById, deleteProduct, updateProduct, getProductsByUser } from "../controllers/Product.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post('/add-product', authenticateToken, addProduct);
router.get('/all-products', getAllProducts);
router.get('/product/:id', authenticateToken,getProductById);
router.put('/edit-product/:id', authenticateToken, updateProduct);
router.delete('/delete-product/:id', authenticateToken, deleteProduct);
router.get('/my-products', authenticateToken, getProductsByUser);

const productRoutes = router;
export default productRoutes;