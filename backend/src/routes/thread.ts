import express from 'express';
import { postParser } from "../middlewares/uploadMiddleware";
import { protect } from "../middlewares/authMiddleware";
import { createThread, getAllThreads, getThread, updateThread, deleteThread, getThreadsByUser } from "../controllers/thread";


const router = express.Router();

// @desc    Create a number of threads
// @route   POST /api/thread
// @access  Private
router.post('/', protect, postParser.single('picture'), createThread);

// @desc    Get all threads
// @route   GET /api/thread
// @access  Private
router.get('/', protect, getAllThreads);

// @desc    Get a thread
// @route   GET /api/thread/:id
// @access  Private
router.get('/:id', protect, getThread);

// @desc    Update a thread
// @route   PUT /api/thread/:id
// @access  Private
router.put('/:id', protect, postParser.single('picture'), updateThread);

// @desc    Delete a thread
// @route   DELETE /api/thread/:id
// @access  Private
router.delete('/:id', protect, deleteThread);

// @desc    Get threads by username
// @route   GET /api/thread/user/:username
// @access  Private
router.get('/user/:username', protect, getThreadsByUser);


export default router;