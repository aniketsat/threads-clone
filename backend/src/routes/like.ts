import express from "express";
import {protect} from "../middlewares/authMiddleware";
import {likePost, unlikePost, likeComment, unlikeComment} from "../controllers/like";


const router = express.Router();

// @desc    Like a post
// @route   POST /api/like/:id
// @access  Private
router.route("/:id").post(protect, likePost);

// @desc    Unlike a post
// @route   DELETE /api/like/:id
// @access  Private
router.route("/:id").delete(protect, unlikePost);

// @desc    Like a comment
// @route   POST /api/like/comment/:id
// @access  Private
router.route("/comment/:id").post(protect, likeComment);

// @desc    Unlike a comment
// @route   DELETE /api/like/comment/:id
// @access  Private
router.route("/comment/:id").delete(protect, unlikeComment);


export default router;