import express from 'express';
const router = express.Router();
import {signupController , logoutController , loginController, updateProfileController, checkAuth} from '../controllers/auth.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js';

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);

router.put("/update-profile" ,protectRoute ,  updateProfileController);
router.get("/check" , protectRoute , checkAuth);

export default router;