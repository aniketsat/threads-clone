import express from "express";
import {protect} from "../middlewares/authMiddleware";
import {createComment, createChildComment, getAllChildComments, getAllComments, updateComment, deleteComment} from "../controllers/comment";


const router = express.Router();

// @desc    Create a comment on a thread
// @route   POST /api/comment/:threadId
// @access  Private
router.post('/:threadId', protect, createComment);

// @desc    Create a child comment on a comment
// @route   POST /api/comment/:commentId
// @access  Private
router.post('/child/:commentId', protect, createChildComment);

// @desc    Get all comments on a thread
// @route   GET /api/comment/:threadId
// @access  Public
router.get('/:threadId', protect, getAllComments);

// @desc    Get all child comments on a comment
// @route   GET /api/comment/:commentId
// @access  Public
router.get('/child/:commentId', protect, getAllChildComments);

// @desc    Update a comment
// @route   PUT /api/comment/:commentId
// @access  Private
router.put('/:commentId', protect, updateComment);

// @desc    Delete a comment
// @route   DELETE /api/comment/:commentId
// @access  Private
router.delete('/:commentId', protect, deleteComment);


export default router;