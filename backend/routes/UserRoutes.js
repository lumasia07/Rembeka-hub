import { Router } from "express";
import { registerUser } from "../controllers/registerUser.js";
import { loginUser, getCurrentUser } from "../controllers/loginUser.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authenticateToken, getCurrentUser);

const userRoutes = router;
export default userRoutes;