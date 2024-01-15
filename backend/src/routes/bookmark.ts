import express from "express";
import {protect} from "../middlewares/authMiddleware";
import {createBookmark, deleteBookmark} from "../controllers/bookmark";


const router = express.Router();

// @desc    Bookmark a thread
// @route   POST /api/bookmark/:id
// @access  Private
router.post('/:id', protect, createBookmark);

// @desc    Unbookmark a thread
// @route   DELETE /api/bookmark/:id
// @access  Private
router.delete('/:id', protect, deleteBookmark);


export default router;