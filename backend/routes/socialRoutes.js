// src/routes/social.ts
import { Router } from "express";
import { 
  addSocial,
  getSocials,
  updateSocial,
  deleteSocial
} from "../controllers/Socials.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/add-socials", authenticateToken, addSocial);
router.get("/all-socials", authenticateToken, getSocials);
router.put("/edit-social/:id", authenticateToken, updateSocial);
router.delete("/delete-social/:id", authenticateToken, deleteSocial);

const socialRoutes = router;
export default socialRoutes;