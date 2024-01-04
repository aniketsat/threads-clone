import express from "express";
import { getCurrentUser, updateCurrentUser, deleteCurrentUser, getUserByUsername } from "../controllers/user";
import { protect } from "../middlewares/authMiddleware";
import {avatarParser} from "../middlewares/uploadMiddleware";


const router = express.Router();

// @desc    Get user profile
// @route   GET /api/user
// @access  Private
router.get('/', protect, getCurrentUser);

// @desc    Update user profile
// @route   PUT /api/user
// @access  Private
router.put('/', protect, avatarParser.single('avatar'), updateCurrentUser);

// @desc    Delete user profile
// @route   DELETE /api/user
// @access  Private
router.delete('/', protect, deleteCurrentUser);

// @desc    Get user profile by username
// @route   GET /api/user/:username
// @access  Public
router.get('/:username', getUserByUsername);

export default router;