import express from "express";
import { protect} from "../middlewares/authMiddleware";
import { followUser, unfollowUser, getFollowersByUsername, getFollowingByUsername } from "../controllers/follow";


const router = express.Router();

// @desc    Follow a user
// @route   POST /api/follow/:id
// @access  Private
router.post('/:id', protect, followUser);

// @desc    Unfollow a user
// @route   DELETE /api/follow/:id
// @access  Private
router.delete('/:id', protect, unfollowUser);

// @desc    Get followers of a user by username
// @route   GET /api/follow/followers
// @access  Private
router.get('/followers/:username', protect, getFollowersByUsername);

// @desc    Get following of a user by username
// @route   GET /api/follow/following
// @access  Private
router.get('/following/:username', protect, getFollowingByUsername);


export default router;