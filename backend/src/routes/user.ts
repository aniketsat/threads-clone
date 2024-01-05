import express from "express";
import { getCurrentUser, updateCurrentUser, deleteCurrentUser, getUserByUsername, updatePassword, changeProfileType } from "../controllers/user";
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

// @desc    Update user password
// @route   PUT /api/user/password
// @access  Private
router.put('/password', protect, updatePassword);

// @desc    Change profile type
// @route   PUT /api/user/type
// @access  Private
router.put('/type', protect, changeProfileType);

export default router;