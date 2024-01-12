import asyncHandler from "express-async-handler";
import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();
const likePost = asyncHandler(async (req, res) => {
    // Get the post id from the request params
    const threadId = req.params.id;

    // Get the user id from the request user object
    // @ts-ignore
    const user = req.user;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        include: {
            Profile: true
        }
    });
    if (!userExists) {
        res.status(404);
        throw new Error("User not found");
    }

    // Check if post exists
    const threadExists = await prisma.thread.findUnique({
        where: {
            id: threadId
        }
    });
    if (!threadExists) {
        res.status(404);
        throw new Error("Thread not found");
    }

    // Check if user has already liked the post
    const likeExists = await prisma.like.findFirst({
        where: {
            ThreadId: threadId,
            ProfileId: userExists?.Profile?.id
        }
    });
    if (likeExists) {
        res.status(400);
        throw new Error("You have already liked this thread");
    }

    // Create the like
    const like = await prisma.like.create({
        data: {
            ThreadId: threadId,
            ProfileId: userExists?.Profile?.id || ''
        }
    });

    // Update the thread likes count
    res.status(201).json({
        message: "Thread liked successfully",
        like
    });
});

const unlikePost = asyncHandler(async (req, res) => {
    const threadId = req.params.id;

    // @ts-ignore
    const user = req.user;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        include: {
            Profile: true
        }
    });
    if (!userExists) {
        res.status(404);
        throw new Error("User not found");
    }

    // Check if post exists
    const threadExists = await prisma.thread.findUnique({
        where: {
            id: threadId
        }
    });
    if (!threadExists) {
        res.status(404);
        throw new Error("Thread not found");
    }

    // Check if user has already liked the post
    const likeExists = await prisma.like.findFirst({
        where: {
            ThreadId: threadId,
            ProfileId: userExists?.Profile?.id
        }
    });
    if (!likeExists) {
        res.status(400);
        throw new Error("You have not liked this thread");
    }

    // Delete the like
    await prisma.like.delete({
        where: {
            id: likeExists.id
        }
    });

    res.status(200).json({
        message: "Thread unliked successfully",
        like: likeExists
    });
});


export {likePost, unlikePost};