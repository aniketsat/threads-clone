import express from "express";
import {protect} from "../middlewares/authMiddleware";
import {likePost, unlikePost} from "../controllers/like";


const router = express.Router();

// @desc    Like a post
// @route   POST /api/like/:id
// @access  Private
router.route("/:id").post(protect, likePost);

// @desc    Unlike a post
// @route   DELETE /api/like/:id
// @access  Private
router.route("/:id").delete(protect, unlikePost);


export default router;