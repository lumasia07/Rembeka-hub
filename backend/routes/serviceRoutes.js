import { Router } from "express";
import { 
    addService, 
    getAllServices, 
    getServiceById, 
    deleteService, 
    updateService 
} from "../controllers/Service.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();

router.post('/add-service', authenticateToken, addService);
router.get('/all-services', getAllServices);
router.get('/service/:id', authenticateToken, getServiceById);
router.put('/edit-service/:id', authenticateToken, updateService);
router.delete('/delete-service/:id', authenticateToken, deleteService);

const serviceRoutes = router;
export default serviceRoutes;