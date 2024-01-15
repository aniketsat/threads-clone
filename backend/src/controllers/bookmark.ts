import asyncHandler from "express-async-handler";
import {PrismaClient} from "@prisma/client";


const prisma = new PrismaClient();

const createBookmark = asyncHandler(async (req, res) => {
    const {id} = req.params;
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
        throw new Error('User not found');
    }

    // Check if thread exists
    const threadExists = await prisma.thread.findUnique({
        where: {
            id
        }
    });
    if (!threadExists) {
        res.status(404);
        throw new Error('Thread not found');
    }

    // Check if bookmark exists
    const bookmarkExists = await prisma.bookmark.findFirst({
        where: {
            ThreadId: threadExists.id as string,
            ProfileId: userExists?.Profile?.id as string
        }
    });
    if (bookmarkExists) {
        res.status(400);
        throw new Error('Thread already bookmarked');
    }

    const bookmark = await prisma.bookmark.create({
        data: {
            ThreadId: threadExists.id as string,
            ProfileId: userExists?.Profile?.id as string
        },
    });

    res.status(201).json({
        message: 'Thread bookmarked',
        bookmark
    });
});

const deleteBookmark = asyncHandler(async (req, res) => {
    const {id} = req.params;
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
        throw new Error('User not found');
    }

    // Check if thread exists
    const threadExists = await prisma.thread.findUnique({
        where: {
            id
        }
    });
    if (!threadExists) {
        res.status(404);
        throw new Error('Thread not found');
    }

    // Check if bookmark exists
    const bookmarkExists = await prisma.bookmark.findFirst({
        where: {
            ThreadId: threadExists.id as string,
            ProfileId: userExists?.Profile?.id as string
        }
    });
    if (!bookmarkExists) {
        res.status(400);
        throw new Error('Thread not bookmarked');
    }

    await prisma.bookmark.delete({
        where: {
            id: bookmarkExists.id
        }
    });

    res.status(200).json({
        message: 'Thread removed from bookmarks',
        bookmark: bookmarkExists
    });
});


export {
    createBookmark,
    deleteBookmark
};