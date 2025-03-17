import { Router } from "express";
import { registerHub } from "../controllers/registerHub.js";
import { authenticateToken } from "../middleware/auth.js";
import { getUserHub } from "../controllers/getuserHub.js";

const router = Router();

router.post('/create-hub', authenticateToken, registerHub);
router.get('/user/:userId', authenticateToken, getUserHub);

const hubRoutes = router;
export default hubRoutes;