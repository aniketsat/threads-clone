import express from "express";
import { login, register, refreshToken, logout } from "../controllers/auth";
import { protect } from "../middlewares/authMiddleware";


const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/refresh-token', refreshToken);

router.post('/logout', protect, logout);


export default router;