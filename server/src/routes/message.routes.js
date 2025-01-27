import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getUserForSideBar , getMessaages , sendMessages } from '../controllers/message.controller.js';
const router = express.Router();


router.get("/users" , protectRoute , getUserForSideBar);
router.get("/:id" , protectRoute , getMessaages);
router.post("/send/:id" , protectRoute , sendMessages);




export default router;