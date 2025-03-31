import { Router } from "express";
import {
  addSocial,
  getSocials,
  updateSocial,
  deleteSocial,
  getSocialsByHubId // Add this import
} from "../controllers/Socials.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post("/add-socials", authenticateToken, addSocial);
router.get("/all-socials", authenticateToken, getSocials);
router.put("/edit-social/:id", authenticateToken, updateSocial);
router.delete("/delete-social/:id", authenticateToken, deleteSocial);
router.get("/hub-socials/:hubId", getSocialsByHubId);

const socialRoutes = router;
export default socialRoutes;